-- ============================================
-- Phase 1.3: Functions & Triggers
-- ============================================

-- 1. 프로필 자동 생성 (최초 로그인 시)
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

-- 2. 주문 번호 생성
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

-- 3. 주문 생성 RPC (장바구니 → 주문 트랜잭션)
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
