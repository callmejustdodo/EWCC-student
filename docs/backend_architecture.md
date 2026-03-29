# Backend Architecture (MVP)

Supabase를 BaaS(Backend as a Service)로 사용합니다. 별도 백엔드 서버 없이 Supabase의 Auth, Database, Storage, RLS로 전체 백엔드를 구성합니다.

---

## 1. Supabase 서비스 구성

| 서비스 | 용도 |
|--------|------|
| **Auth** | Google OAuth 인증 |
| **Database** (PostgreSQL) | 제품, 장바구니, 주문, 프로필 데이터 |
| **Storage** | 제품 이미지 저장 |
| **Row Level Security** | 테이블별 접근 권한 제어 |
| **Database Functions** | 주문 생성 트랜잭션, 주문번호 생성 |
| **Triggers** | 최초 로그인 시 프로필 자동 생성 |

---

## 2. 데이터베이스 스키마

### 2.1 ERD

```
auth.users (Supabase 관리)
    │
    │ 1:1
    ▼
profiles ─────────────────────────┐
    │                             │
    │ 1:N                    1:N  │
    ▼                             ▼
cart_items ──> products      orders
               ▲               │
               │          1:N  │
               │               ▼
               └────── order_items
```

### 2.2 테이블 정의

#### `profiles`
```sql
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  phone       TEXT,
  address     TEXT,
  zip_code    TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

#### `products`
```sql
CREATE TABLE products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  price           INTEGER NOT NULL,
  category        TEXT NOT NULL CHECK (category IN ('sunglasses', 'optical', 'bluelight')),
  description     TEXT NOT NULL,
  material        TEXT NOT NULL,
  sizes           TEXT[] NOT NULL DEFAULT '{}',
  colors          JSONB NOT NULL DEFAULT '[]',
  images          TEXT[] NOT NULL DEFAULT '{}',
  is_bestseller   BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

#### `cart_items`
```sql
CREATE TABLE cart_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color       TEXT NOT NULL,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
  created_at  TIMESTAMPTZ DEFAULT now(),

  UNIQUE (user_id, product_id, color)
);
```

#### `orders`
```sql
CREATE TABLE orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES profiles(id),
  order_number      TEXT UNIQUE NOT NULL,
  shipping_name     TEXT NOT NULL,
  shipping_phone    TEXT NOT NULL,
  shipping_address  TEXT NOT NULL,
  shipping_zip_code TEXT NOT NULL,
  shipping_memo     TEXT,
  payment_method    TEXT NOT NULL,
  total_amount      INTEGER NOT NULL,
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'confirmed', 'shipping', 'delivered')),
  created_at        TIMESTAMPTZ DEFAULT now()
);
```

#### `order_items`
```sql
CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id),
  color       TEXT NOT NULL,
  quantity    INTEGER NOT NULL CHECK (quantity >= 1),
  price       INTEGER NOT NULL
);
```

### 2.3 인덱스

```sql
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_bestseller ON products(is_bestseller) WHERE is_bestseller = true;
```

---

## 3. Row Level Security (RLS)

모든 테이블에 RLS를 활성화합니다.

### 3.1 `products` — 누구나 읽기

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select_all"
  ON products FOR SELECT
  USING (true);
```

### 3.2 `profiles` — 본인만 읽기/수정

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

### 3.3 `cart_items` — 본인만 CRUD

```sql
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cart_select_own"
  ON cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "cart_insert_own"
  ON cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cart_update_own"
  ON cart_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cart_delete_own"
  ON cart_items FOR DELETE
  USING (auth.uid() = user_id);
```

### 3.4 `orders` — 본인만 읽기, 삽입

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select_own"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "orders_insert_own"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### 3.5 `order_items` — 본인 주문의 항목만 읽기

```sql
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_select_own"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items_insert_own"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );
```

---

## 4. Database Functions & Triggers

### 4.1 프로필 자동 생성 (최초 로그인 시)

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

### 4.2 주문 번호 생성

```sql
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'LS-' || TO_CHAR(now(), 'YYYYMMDD') || '-' ||
                LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;
```

### 4.3 주문 생성 (트랜잭션 — RPC)

장바구니 → 주문 변환을 단일 트랜잭션으로 처리합니다.

```sql
CREATE OR REPLACE FUNCTION create_order(
  p_shipping_name     TEXT,
  p_shipping_phone    TEXT,
  p_shipping_address  TEXT,
  p_shipping_zip_code TEXT,
  p_shipping_memo     TEXT DEFAULT NULL,
  p_payment_method    TEXT DEFAULT 'card'
)
RETURNS UUID AS $$
DECLARE
  v_user_id      UUID := auth.uid();
  v_order_id     UUID;
  v_order_number TEXT;
  v_total        INTEGER;
BEGIN
  -- 장바구니가 비어있는지 확인
  IF NOT EXISTS (SELECT 1 FROM cart_items WHERE user_id = v_user_id) THEN
    RAISE EXCEPTION 'Cart is empty';
  END IF;

  -- 주문 번호 생성
  v_order_number := generate_order_number();

  -- 총액 계산
  SELECT COALESCE(SUM(p.price * ci.quantity), 0)
  INTO v_total
  FROM cart_items ci
  JOIN products p ON p.id = ci.product_id
  WHERE ci.user_id = v_user_id;

  -- 주문 생성
  INSERT INTO orders (user_id, order_number, shipping_name, shipping_phone,
                      shipping_address, shipping_zip_code, shipping_memo,
                      payment_method, total_amount)
  VALUES (v_user_id, v_order_number, p_shipping_name, p_shipping_phone,
          p_shipping_address, p_shipping_zip_code, p_shipping_memo,
          p_payment_method, v_total)
  RETURNING id INTO v_order_id;

  -- 장바구니 → 주문 항목 복사
  INSERT INTO order_items (order_id, product_id, color, quantity, price)
  SELECT v_order_id, ci.product_id, ci.color, ci.quantity, p.price
  FROM cart_items ci
  JOIN products p ON p.id = ci.product_id
  WHERE ci.user_id = v_user_id;

  -- 장바구니 비우기
  DELETE FROM cart_items WHERE user_id = v_user_id;

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 5. 인증 (Auth) 설정

### 5.1 이메일/비밀번호

| 설정 | 값 |
|------|-----|
| Email 가입 허용 | OFF (Google OAuth만 사용) |
| 비밀번호 로그인 | 사용 안 함 |

### 5.2 OAuth Providers

| Provider | 설정 |
|----------|------|
| Google | Client ID + Secret (Google Cloud Console) |

### 5.3 Redirect URL

```
{SITE_URL}/auth/callback
```

### 5.4 OAuth 콜백 처리 (`app/auth/callback/route.ts`)

```ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
```

---

## 6. Storage 설정

### 6.1 버킷

| 버킷 | 공개 여부 | 용도 |
|------|----------|------|
| `product-images` | Public | 제품 이미지 |

### 6.2 파일 구조

```
product-images/
├── {product_id}/
│   ├── main-01.webp
│   ├── main-02.webp
│   ├── main-03.webp
│   └── thumb-01.webp
```

### 6.3 이미지 URL 패턴

```
{SUPABASE_URL}/storage/v1/object/public/product-images/{product_id}/{filename}
```

---

## 7. API 호출 패턴

### 7.1 서버 컴포넌트에서 데이터 조회

```ts
// app/products/page.tsx (Server Component)
import { createClient } from '@/lib/supabase/server';

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return <ProductGrid products={products} />;
}
```

### 7.2 클라이언트에서 장바구니 CRUD

```ts
// hooks/use-cart.ts
const supabase = createClient();  // 브라우저 클라이언트

// 조회
const { data } = await supabase
  .from('cart_items')
  .select('*, products(*)')
  .eq('user_id', userId);

// 추가 (UPSERT: 같은 제품+색상이면 수량 증가)
await supabase
  .from('cart_items')
  .upsert(
    { user_id: userId, product_id, color, quantity },
    { onConflict: 'user_id,product_id,color' }
  );

// 수량 변경
await supabase
  .from('cart_items')
  .update({ quantity })
  .eq('id', itemId);

// 삭제
await supabase
  .from('cart_items')
  .delete()
  .eq('id', itemId);
```

### 7.3 주문 생성 (RPC 호출)

```ts
// app/checkout/page.tsx
const { data: orderId, error } = await supabase.rpc('create_order', {
  p_shipping_name: shippingInfo.name,
  p_shipping_phone: shippingInfo.phone,
  p_shipping_address: shippingInfo.address,
  p_shipping_zip_code: shippingInfo.zipCode,
  p_shipping_memo: shippingInfo.memo,
  p_payment_method: paymentMethod,
});

if (!error) {
  router.push(`/order-complete?orderId=${orderId}`);
}
```

### 7.4 주문 내역 조회

```ts
// app/mypage/page.tsx (Server Component)
const { data: orders } = await supabase
  .from('orders')
  .select('*, order_items(*, products(name, images))')
  .order('created_at', { ascending: false });
```

---

## 8. 보안 체크리스트

| 항목 | 구현 |
|------|------|
| RLS 활성화 | 모든 테이블에 적용 |
| anon key만 클라이언트 노출 | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| service_role key는 서버만 | 환경 변수로 관리, 클라이언트에 노출 금지 |
| 주문 생성은 SECURITY DEFINER | `create_order` RPC로 서버 권한 실행 |
| 입력 검증 | DB CHECK 제약 + 프론트 유효성 검사 |
| CORS | Supabase 프로젝트 설정에서 도메인 제한 |

---

## 9. 시드 데이터

MVP 개발/테스트용으로 8~12개 제품 시드 데이터를 준비합니다.

```sql
INSERT INTO products (name, price, category, description, material, sizes, colors, images, is_bestseller)
VALUES
  ('Classic Round', 189000, 'optical', '클래식 라운드 프레임...', '티타늄', ARRAY['S','M','L'],
   '[{"name":"블랙","hex":"#000000","image_index":0},{"name":"골드","hex":"#D4AF37","image_index":1}]'::jsonb,
   ARRAY['classic-round/main-01.webp','classic-round/main-02.webp'], true),
  -- ... 추가 제품
;
```

---

## 10. Supabase 프로젝트 설정 요약

```
1. 프로젝트 생성 (Supabase Dashboard)
2. 테이블 생성 (SQL Editor에서 위 스키마 실행)
3. RLS 정책 적용
4. Trigger + Functions 생성
5. Auth → Providers → Google 설정
6. Storage → product-images 버킷 생성 (Public)
7. 시드 데이터 INSERT
8. 환경 변수 (.env.local) 설정
```
