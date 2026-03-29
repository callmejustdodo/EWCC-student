# Frontend Architecture (MVP)

---

## 1. 기술 스택

| 영역 | 기술 | 비고 |
|------|------|------|
| 프레임워크 | Next.js 16 (App Router) | RSC + Turbopack |
| 언어 | TypeScript | strict mode |
| 스타일링 | Tailwind CSS v4 | CSS variables 기반 |
| UI 컴포넌트 | shadcn/ui (radix-nova) | Radix UI primitives |
| 아이콘 | Hugeicons | `@hugeicons/react` |
| 폰트 | Roboto (sans) / Geist Mono (mono) | `next/font/google` |
| 테마 | next-themes | ThemeProvider 적용 |
| 백엔드/DB | Supabase | Auth + PostgreSQL + Storage |
| Supabase 클라이언트 | `@supabase/ssr` | SSR/CSR 겸용 |

---

## 2. 디렉토리 구조

```
next-app/
├── app/                          # App Router (라우트)
│   ├── layout.tsx                # 루트 레이아웃 (헤더 + 푸터 + Providers)
│   ├── page.tsx                  # S01: 랜딩 페이지
│   ├── globals.css               # 글로벌 스타일 + CSS 변수
│   │
│   ├── products/
│   │   ├── page.tsx              # S02: 제품 목록
│   │   └── [id]/
│   │       └── page.tsx          # S03: 제품 상세
│   │
│   ├── cart/
│   │   └── page.tsx              # S04: 장바구니
│   │
│   ├── checkout/
│   │   └── page.tsx              # S05: 체크아웃
│   │
│   ├── order-complete/
│   │   └── page.tsx              # S06: 주문 완료
│   │
│   ├── login/
│   │   └── page.tsx              # S07: 로그인 (Google OAuth)
│   │
│   ├── mypage/
│   │   └── page.tsx              # S09: 마이페이지
│   │
│   └── auth/
│       └── callback/
│           └── route.ts          # OAuth 콜백 처리 (Route Handler)
│
├── components/
│   ├── ui/                       # shadcn/ui 기본 컴포넌트
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── sheet.tsx             # 모바일 드로어
│   │   ├── toast.tsx
│   │   └── ...
│   │
│   ├── layout/                   # 레이아웃 컴포넌트
│   │   ├── header.tsx            # C01/C02: 반응형 헤더
│   │   ├── mobile-drawer.tsx     # C03: 모바일 메뉴 드로어
│   │   └── footer.tsx            # C04: 푸터
│   │
│   ├── product/                  # 제품 관련 컴포넌트
│   │   ├── product-card.tsx      # C05: 제품 카드 (재사용)
│   │   ├── product-grid.tsx      # 제품 그리드 레이아웃
│   │   ├── product-filter.tsx    # 카테고리 필터
│   │   ├── product-sort.tsx      # 정렬 셀렉트
│   │   ├── image-gallery.tsx     # 이미지 갤러리 (메인 + 썸네일)
│   │   ├── color-swatch.tsx      # 컬러 스와치 선택
│   │   └── quantity-selector.tsx # 수량 +/- 선택
│   │
│   ├── cart/                     # 장바구니 관련 컴포넌트
│   │   ├── cart-item.tsx         # 장바구니 아이템 행
│   │   ├── cart-summary.tsx      # 주문 요약 (소계/배송비/총액)
│   │   └── empty-cart.tsx        # 빈 장바구니 안내
│   │
│   ├── checkout/                 # 체크아웃 관련 컴포넌트
│   │   ├── shipping-form.tsx     # 배송 정보 폼
│   │   ├── payment-method.tsx    # 결제 수단 선택 (UI only)
│   │   └── order-review.tsx      # 주문 최종 요약
│   │
│   ├── auth/                     # 인증 관련 컴포넌트
│   │   ├── google-login.tsx      # Google OAuth 로그인 버튼
│   │   └── auth-guard.tsx        # 인증 가드 (보호 라우트 래퍼)
│   │
│   ├── mypage/                   # 마이페이지 관련 컴포넌트
│   │   ├── order-list.tsx        # 주문 내역 목록
│   │   ├── order-detail.tsx      # 주문 상세 (펼치기)
│   │   └── profile-info.tsx      # 프로필 정보
│   │
│   ├── home/                     # 랜딩 페이지 섹션 컴포넌트
│   │   ├── hero-section.tsx      # 히어로 (풀스크린)
│   │   ├── brand-section.tsx     # 브랜드 소개
│   │   └── bestseller-section.tsx# 베스트셀러 추천
│   │
│   └── theme-provider.tsx        # 테마 Provider (기존)
│
├── lib/
│   ├── utils.ts                  # cn() 등 유틸리티 (기존)
│   ├── constants.ts              # 배송비, 무료배송 기준 등 상수
│   ├── format.ts                 # 가격 포맷 (₩1,000) 등
│   └── supabase/
│       ├── client.ts             # 브라우저 Supabase 클라이언트
│       ├── server.ts             # 서버 Supabase 클라이언트
│       └── middleware.ts         # 세션 갱신 미들웨어 헬퍼
│
├── types/
│   ├── index.ts                  # Product, CartItem, Order 등 앱 타입
│   └── supabase.ts              # Supabase 자동 생성 DB 타입
│
├── hooks/
│   ├── use-auth.ts               # 인증 상태 훅
│   └── use-cart.ts               # 장바구니 훅 (Supabase CRUD)
│
├── contexts/
│   ├── auth-context.tsx          # 인증 Context + Provider
│   └── cart-context.tsx          # 장바구니 Context + Provider
│
└── middleware.ts                  # Next.js 미들웨어 (세션 갱신 + 인증 가드)
```

---

## 3. 라우트 & 렌더링 전략

| 라우트 | 렌더링 | 인증 | 이유 |
|--------|--------|------|------|
| `/` | SSR | 불필요 | 베스트셀러를 Supabase에서 fetch |
| `/products` | SSR + Client | 불필요 | 서버에서 초기 데이터 fetch, 클라이언트에서 필터/정렬 |
| `/products/[id]` | SSR | 불필요 | 서버에서 제품 데이터 fetch |
| `/cart` | Client | 필요 | 장바구니 상태(Supabase) 의존 |
| `/checkout` | Client | 필요 | 폼 입력 + 상태 관리 |
| `/order-complete` | Client | 필요 | 주문 데이터 참조 |
| `/login` | Client | 비로그인만 | Google OAuth 버튼 |
| `/mypage` | SSR + Client | 필요 | 서버에서 주문 데이터 fetch |
| `/auth/callback` | Route Handler | - | OAuth 리다이렉트 처리 |

---

## 4. 인증 아키텍처

### 4.1 Supabase Auth 흐름

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Middleware                     │
│  middleware.ts                                           │
│  - 모든 요청에서 Supabase 세션 갱신                       │
│  - 보호 라우트 접근 시 세션 확인 → 없으면 /login 리다이렉트  │
└─────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
                      Google OAuth
                    (redirect → /auth/callback)
                              │
                              ▼
                    AuthContext (전역 상태)
                    ├── user: User | null
                    ├── profile: Profile | null
                    ├── isLoading: boolean
                    └── signOut()
```

### 4.2 보호 라우트

`middleware.ts`에서 처리합니다:
- `/cart`, `/checkout`, `/order-complete`, `/mypage` → 세션 없으면 `/login?redirect={원래경로}`로 리다이렉트
- `/login` → 세션 있으면 `/`로 리다이렉트

---

## 5. 상태 관리 설계

### 5.1 인증 (AuthContext)

```
AuthProvider (contexts/auth-context.tsx)
  │
  ├── state:
  │   ├── user: User | null          → Supabase auth.user
  │   ├── profile: Profile | null    → profiles 테이블
  │   └── isLoading: boolean
  │
  ├── actions:
  │   ├── signInWithGoogle()
  │   └── signOut()
  │
  └── listener: onAuthStateChange → 세션 변경 시 자동 갱신
```

### 5.2 장바구니 (CartContext)

로그인 사용자는 Supabase `cart_items` 테이블에서 관리합니다.

```
CartProvider (contexts/cart-context.tsx)
  │
  ├── state: CartItem[] (Supabase에서 fetch)
  │
  ├── actions:
  │   ├── addItem(productId, color, quantity)     → INSERT cart_items
  │   ├── updateQuantity(itemId, quantity)         → UPDATE cart_items
  │   ├── removeItem(itemId)                       → DELETE cart_items
  │   └── clearCart()                              → DELETE all user's cart_items
  │
  ├── derived:
  │   ├── totalItems        → 헤더 뱃지 숫자
  │   ├── subtotal          → 소계 (products join)
  │   ├── shippingFee       → 배송비 (조건부 무료)
  │   └── totalAmount       → 총액
  │
  └── sync: Supabase Realtime (선택) 또는 mutation 후 refetch
```

### 5.3 체크아웃 → 주문 완료 데이터 전달

```
체크아웃에서 주문 완료 시:
  1. Supabase에 orders + order_items INSERT
  2. 반환된 order_id를 URL 파라미터로 전달
  3. router.push("/order-complete?orderId={id}")
  4. 주문 완료 페이지에서 Supabase로 해당 주문 조회
  5. clearCart() 호출
```

---

## 6. Supabase 클라이언트 구성

### 6.1 브라우저 클라이언트 (`lib/supabase/client.ts`)

```ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### 6.2 서버 클라이언트 (`lib/supabase/server.ts`)

```ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* cookieStore 연동 */ } }
  );
}
```

### 6.3 환경 변수

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 7. 컴포넌트 설계 원칙

### 7.1 Server vs Client Component

```
Server Component (기본)         Client Component ("use client")
─────────────────────────       ─────────────────────────────
layout.tsx                      header.tsx (드로어/인증 상태)
page.tsx (랜딩, 제품목록 등)     mobile-drawer.tsx
footer.tsx                      product-filter.tsx (필터 상태)
                                product-sort.tsx (정렬 상태)
                                image-gallery.tsx (이미지 전환)
                                color-swatch.tsx (선택 상태)
                                quantity-selector.tsx (수량 상태)
                                cart-item.tsx (수량/삭제)
                                shipping-form.tsx (폼 상태)
                                payment-method.tsx (선택 상태)
                                google-login.tsx (OAuth)
                                auth-guard.tsx (인증 체크)
                                auth-context.tsx (Provider)
                                cart-context.tsx (Provider)
```

### 7.2 컴포넌트 네이밍 규칙

- 파일명: `kebab-case.tsx` (예: `product-card.tsx`)
- 컴포넌트명: `PascalCase` (예: `ProductCard`)
- Props 타입: `컴포넌트명 + Props` (예: `ProductCardProps`)

---

## 8. 스타일링 가이드

### 8.1 디자인 토큰 (CSS Variables)

shadcn/ui의 radix-nova 테마 + mist 베이스 컬러를 사용하며, 글로벌 CSS 변수로 관리합니다.

```
--font-sans: Roboto
--font-mono: Geist Mono

색상: shadcn/ui mist 팔레트 기반
  --background, --foreground
  --primary, --primary-foreground
  --muted, --muted-foreground
  --border, --ring
```

### 8.2 반응형 브레이크포인트

| 토큰 | 너비 | 용도 |
|------|------|------|
| (기본) | < 768px | 모바일 (1~2열 그리드) |
| `md:` | >= 768px | 태블릿 (2~3열 그리드) |
| `lg:` | >= 1024px | 데스크톱 (3~4열 그리드) |

### 8.3 애니메이션

- `tw-animate-css` 라이브러리를 활용한 기본 애니메이션
- 히어로 섹션: `scroll` 이벤트 기반 패럴럭스/페이드
- 제품 카드: `hover:scale-[1.02]` + `transition-transform`
- 페이지 전환: CSS `transition` 기반 fade

---

## 9. 페이지별 컴포넌트 매핑

### S01: 랜딩 페이지 (`/`)
```
layout.tsx (AuthProvider + CartProvider + Header + Footer)
└── page.tsx (Server: Supabase에서 베스트셀러 fetch)
    ├── HeroSection
    ├── BrandSection
    └── BestsellerSection
        └── ProductCard (x3~4)
```

### S02: 제품 목록 (`/products`)
```
page.tsx (Server: Supabase에서 전체 제품 fetch)
├── ProductFilter (Client)
├── ProductSort (Client)
└── ProductGrid
    └── ProductCard (xN)
```

### S03: 제품 상세 (`/products/[id]`)
```
page.tsx (Server: Supabase에서 제품 fetch)
├── ImageGallery (Client)
├── (제품 정보 영역)
│   ├── ColorSwatch (Client)
│   ├── QuantitySelector (Client)
│   └── Button ("장바구니 담기") (Client)
└── 관련 제품 섹션
    └── ProductCard (x2~3)
```

### S04: 장바구니 (`/cart`)
```
page.tsx (Client: CartContext에서 데이터)
├── AuthGuard
├── CartItem (xN) 또는 EmptyCart
└── CartSummary
    └── Button ("주문하기")
```

### S05: 체크아웃 (`/checkout`)
```
page.tsx (Client)
├── AuthGuard
├── ShippingForm (프로필 정보 자동 입력)
├── PaymentMethod
├── OrderReview
└── Button ("주문 완료")
```

### S06: 주문 완료 (`/order-complete`)
```
page.tsx (Client: orderId로 Supabase 조회)
├── AuthGuard
├── (주문 번호 + 내역 요약)
└── Button ("쇼핑 계속하기")
```

### S07: 로그인 (`/login`)
```
page.tsx (Client)
└── GoogleLogin (Google OAuth 버튼)
```

### S09: 마이페이지 (`/mypage`)
```
page.tsx (Server: Supabase에서 주문 내역 fetch)
├── AuthGuard
├── ProfileInfo
└── OrderList
    └── OrderDetail (펼치기/접기)
```

---

## 10. 주요 의존성 흐름

```
Supabase Auth
    │
    ├──> middleware.ts (세션 갱신 + 라우트 가드)
    ├──> contexts/auth-context.tsx (AuthProvider)
    │       ├──> header.tsx (로그인 상태 → 사용자 아이콘)
    │       ├──> auth-guard.tsx (보호 라우트 래퍼)
    │       └──> cart-context.tsx (user_id 참조)
    │
    └──> app/auth/callback/route.ts (OAuth 콜백)

Supabase DB (cart_items)
    │
    └──> contexts/cart-context.tsx (CartProvider)
            ├──> header.tsx (totalItems → 뱃지)
            ├──> product 상세 ("장바구니 담기" → addItem)
            ├──> cart-item.tsx (updateQuantity, removeItem)
            ├──> cart-summary.tsx (subtotal, shippingFee, totalAmount)
            └──> checkout/page.tsx (items → 주문 생성, clearCart)

Supabase DB (products)
    │
    ├──> app/page.tsx (베스트셀러)
    ├──> app/products/page.tsx (전체 목록)
    ├──> app/products/[id]/page.tsx (상세)
    └──> cart-context.tsx (제품 정보 join)

Supabase DB (orders + order_items)
    │
    ├──> app/checkout/page.tsx (주문 생성 INSERT)
    ├──> app/order-complete/page.tsx (주문 조회)
    └──> app/mypage/page.tsx (주문 내역 목록)
```
