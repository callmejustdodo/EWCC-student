-- ============================================
-- Phase 1.7: 시드 데이터 (제품 12개)
-- ============================================

INSERT INTO products (name, price, category, description, material, sizes, colors, images, is_bestseller)
VALUES
  -- === 안경 (Optical) - 4개 ===
  (
    'Classic Round',
    189000,
    'optical',
    '시대를 초월하는 클래식 라운드 프레임. 가벼운 티타늄 소재로 하루 종일 편안한 착용감을 제공합니다.',
    '티타늄',
    ARRAY['S', 'M', 'L'],
    '[{"name":"블랙","hex":"#000000","image_index":0},{"name":"골드","hex":"#D4AF37","image_index":1},{"name":"실버","hex":"#C0C0C0","image_index":2}]'::jsonb,
    ARRAY['classic-round/main-01.webp','classic-round/main-02.webp','classic-round/main-03.webp'],
    true
  ),
  (
    'Modern Square',
    219000,
    'optical',
    '세련된 스퀘어 프레임으로 지적인 인상을 연출합니다. 스테인리스 스틸의 견고한 내구성.',
    '스테인리스 스틸',
    ARRAY['M', 'L'],
    '[{"name":"매트 블랙","hex":"#1A1A1A","image_index":0},{"name":"건메탈","hex":"#536878","image_index":1}]'::jsonb,
    ARRAY['modern-square/main-01.webp','modern-square/main-02.webp'],
    true
  ),
  (
    'Minimal Oval',
    169000,
    'optical',
    '미니멀한 오벌 프레임. 얇고 가벼운 디자인으로 어떤 얼굴형에도 자연스럽게 어울립니다.',
    '베타 티타늄',
    ARRAY['S', 'M'],
    '[{"name":"로즈 골드","hex":"#B76E79","image_index":0},{"name":"블랙","hex":"#000000","image_index":1}]'::jsonb,
    ARRAY['minimal-oval/main-01.webp','minimal-oval/main-02.webp'],
    false
  ),
  (
    'Retro Boston',
    199000,
    'optical',
    '빈티지 감성의 보스턴 프레임. 클래식한 디자인에 현대적 착용감을 더했습니다.',
    '아세테이트',
    ARRAY['M', 'L'],
    '[{"name":"토터스","hex":"#8B4513","image_index":0},{"name":"블랙","hex":"#000000","image_index":1},{"name":"크리스탈","hex":"#E8E8E8","image_index":2}]'::jsonb,
    ARRAY['retro-boston/main-01.webp','retro-boston/main-02.webp','retro-boston/main-03.webp'],
    false
  ),

  -- === 선글라스 (Sunglasses) - 4개 ===
  (
    'Aviator Pro',
    259000,
    'sunglasses',
    '아이코닉한 에비에이터 실루엣에 프리미엄 편광 렌즈를 장착. UV400 완벽 차단.',
    '티타늄',
    ARRAY['M', 'L'],
    '[{"name":"골드/그린","hex":"#D4AF37","image_index":0},{"name":"실버/블루","hex":"#C0C0C0","image_index":1}]'::jsonb,
    ARRAY['aviator-pro/main-01.webp','aviator-pro/main-02.webp'],
    true
  ),
  (
    'Wayfarer Edge',
    239000,
    'sunglasses',
    '모던하게 재해석한 웨이페어러. 날카로운 엣지 라인이 강렬한 인상을 만듭니다.',
    '아세테이트',
    ARRAY['M', 'L'],
    '[{"name":"블랙","hex":"#000000","image_index":0},{"name":"토터스","hex":"#8B4513","image_index":1},{"name":"네이비","hex":"#1B2A4A","image_index":2}]'::jsonb,
    ARRAY['wayfarer-edge/main-01.webp','wayfarer-edge/main-02.webp','wayfarer-edge/main-03.webp'],
    false
  ),
  (
    'Cat Eye Luxe',
    279000,
    'sunglasses',
    '우아한 캣아이 프레임. 볼드한 실루엣이 세련된 무드를 완성합니다.',
    '아세테이트',
    ARRAY['S', 'M'],
    '[{"name":"블랙","hex":"#000000","image_index":0},{"name":"버건디","hex":"#722F37","image_index":1}]'::jsonb,
    ARRAY['cat-eye-luxe/main-01.webp','cat-eye-luxe/main-02.webp'],
    false
  ),
  (
    'Sport Shield',
    299000,
    'sunglasses',
    '스포츠에 최적화된 쉴드 렌즈. 넓은 시야각과 미끄럼 방지 노즈패드를 갖추었습니다.',
    'TR-90',
    ARRAY['M', 'L'],
    '[{"name":"매트 블랙","hex":"#1A1A1A","image_index":0},{"name":"화이트","hex":"#FFFFFF","image_index":1}]'::jsonb,
    ARRAY['sport-shield/main-01.webp','sport-shield/main-02.webp'],
    true
  ),

  -- === 블루라이트 차단 (Bluelight) - 4개 ===
  (
    'Screen Guard',
    149000,
    'bluelight',
    '디지털 라이프를 위한 블루라이트 차단 안경. 40% 이상의 청색광을 효과적으로 차단합니다.',
    'TR-90',
    ARRAY['S', 'M', 'L'],
    '[{"name":"블랙","hex":"#000000","image_index":0},{"name":"클리어","hex":"#F5F5F5","image_index":1}]'::jsonb,
    ARRAY['screen-guard/main-01.webp','screen-guard/main-02.webp'],
    false
  ),
  (
    'Office Lite',
    159000,
    'bluelight',
    '사무실에서 하루 종일 착용해도 편안한 초경량 블루라이트 안경. 무게 단 18g.',
    '울템',
    ARRAY['M', 'L'],
    '[{"name":"블랙","hex":"#000000","image_index":0},{"name":"브라운","hex":"#6B4226","image_index":1},{"name":"네이비","hex":"#1B2A4A","image_index":2}]'::jsonb,
    ARRAY['office-lite/main-01.webp','office-lite/main-02.webp','office-lite/main-03.webp'],
    false
  ),
  (
    'Gaming Pro',
    179000,
    'bluelight',
    '게이머를 위한 블루라이트 차단 안경. 넓은 렌즈와 안정적인 핏으로 장시간 사용에 최적.',
    'TR-90',
    ARRAY['M', 'L'],
    '[{"name":"블랙/레드","hex":"#1A1A1A","image_index":0},{"name":"블랙/블루","hex":"#000033","image_index":1}]'::jsonb,
    ARRAY['gaming-pro/main-01.webp','gaming-pro/main-02.webp'],
    false
  ),
  (
    'Daily Comfort',
    139000,
    'bluelight',
    '매일 착용하기 좋은 심플한 블루라이트 안경. 부담 없는 가격에 확실한 눈 보호.',
    '울템',
    ARRAY['S', 'M'],
    '[{"name":"블랙","hex":"#000000","image_index":0},{"name":"투명 핑크","hex":"#FFB6C1","image_index":1}]'::jsonb,
    ARRAY['daily-comfort/main-01.webp','daily-comfort/main-02.webp'],
    false
  );
