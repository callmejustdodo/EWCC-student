-- ============================================
-- Phase 1.1: 테이블 생성
-- ============================================

-- 1. products (의존성 없음)
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

-- 2. profiles (auth.users 의존)
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  phone       TEXT,
  address     TEXT,
  zip_code    TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 3. cart_items (profiles, products 의존)
CREATE TABLE cart_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color       TEXT NOT NULL,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, product_id, color)
);

-- 4. orders (profiles 의존)
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

-- 5. order_items (orders, products 의존)
CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id),
  color       TEXT NOT NULL,
  quantity    INTEGER NOT NULL CHECK (quantity >= 1),
  price       INTEGER NOT NULL
);

-- ============================================
-- Phase 1.4: 인덱스
-- ============================================

CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_bestseller ON products(is_bestseller) WHERE is_bestseller = true;
