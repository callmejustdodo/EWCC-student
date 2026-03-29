# Product Requirements Document (MVP)

## 1. 제품 개요

**제품명:** (가칭) LENS - 안경 브랜드 웹사이트
**목표:** 애플 스타일의 미니멀하고 세련된 디자인으로, 안경 제품을 브라우징하고 주문까지 완료할 수 있는 웹사이트
**기술 스택:** Next.js 16 (App Router) / Tailwind CSS v4 / shadcn/ui / Radix UI / TypeScript / Supabase

---

## 2. 타겟 유저

- 온라인으로 안경을 탐색하고 구매하려는 2030 고객
- 디자인과 브랜드 감성을 중시하는 소비자

---

## 3. 핵심 디자인 원칙

| 원칙 | 설명 |
|------|------|
| **미니멀리즘** | 여백을 충분히 활용, 콘텐츠에 집중 |
| **대형 비주얼** | 제품 이미지를 풀스크린/히어로 섹션으로 강조 |
| **부드러운 인터랙션** | 스크롤 애니메이션, 호버 효과, 페이지 전환 |
| **타이포그래피 중심** | 깔끔한 산세리프 폰트, 명확한 위계 |
| **모노톤 + 포인트** | 흰/검 베이스에 브랜드 컬러 최소 사용 |

---

## 4. MVP 페이지 구조

### 4.1 랜딩 페이지 (`/`)
- **히어로 섹션:** 풀스크린 제품 이미지 + 브랜드 카피 + CTA 버튼("컬렉션 보기")
- **브랜드 소개 섹션:** 한 줄 브랜드 철학 + 간단한 설명 텍스트
- **추천 제품 섹션:** 베스트셀러 3~4개 카드 형태 노출
- **푸터:** 브랜드 정보, 소셜 링크, 고객센터 안내

### 4.2 제품 목록 페이지 (`/products`)
- **필터:** 카테고리별 (선글라스 / 안경 / 블루라이트 차단)
- **제품 카드:** 제품 이미지 + 이름 + 가격
- **정렬:** 최신순 / 가격 낮은순 / 가격 높은순
- **반응형 그리드:** 데스크톱 3~4열, 모바일 1~2열

### 4.3 제품 상세 페이지 (`/products/[id]`)
- **제품 이미지 갤러리:** 여러 앵글 이미지 전환 (메인 이미지 + 썸네일)
- **제품 정보:** 이름, 가격, 설명, 소재, 사이즈 정보
- **옵션 선택:** 색상 선택 (컬러 스와치)
- **수량 선택 + 장바구니 담기 버튼**
- **관련 제품 추천:** 하단에 2~3개 노출

### 4.4 장바구니 페이지 (`/cart`)
- **장바구니 아이템 목록:** 이미지, 이름, 옵션, 수량 조절, 개별 삭제
- **주문 요약:** 소계, 배송비, 총액
- **주문하기 CTA 버튼**

### 4.5 주문/체크아웃 페이지 (`/checkout`)
- **배송 정보 입력:** 이름, 연락처, 주소 (우편번호 검색)
- **배송 메모** (선택)
- **결제 수단 선택:** (MVP에서는 UI만 구현, 실제 PG 연동 없음)
  - 신용카드 / 네이버페이 표시
- **주문 요약 확인**
- **주문 완료 버튼**

### 4.6 주문 완료 페이지 (`/order-complete`)
- 주문 번호 표시
- 주문 내역 요약
- "쇼핑 계속하기" 버튼

### 4.7 인증 페이지
- **로그인 (`/login`):** Google OAuth 로그인
- **마이페이지 (`/mypage`):** 주문 내역 조회 + 회원 정보 확인

---

## 5. 공통 컴포넌트

### 5.1 헤더/네비게이션
- 로고 (좌측)
- 메뉴: 컬렉션, 브랜드 소개
- 아이콘: 장바구니 (아이템 수 뱃지), 사용자 (로그인/마이페이지)
- 모바일: 햄버거 메뉴 + 슬라이드 드로어

### 5.2 푸터
- 브랜드 로고 + 한 줄 설명
- 링크 그룹: 고객센터, 배송/반품, 이용약관, 개인정보처리방침
- SNS 아이콘

---

## 6. 데이터 모델

Supabase (PostgreSQL)를 사용하여 데이터를 관리합니다.

### 6.1 DB 테이블

#### `profiles` (회원 정보 - Supabase Auth 연동)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK, FK → auth.users) | 사용자 ID |
| name | text | 이름 |
| phone | text | 연락처 |
| address | text | 기본 배송 주소 |
| zip_code | text | 우편번호 |
| created_at | timestamptz | 가입일 |

#### `products` (제품)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | 제품 ID |
| name | text | 제품명 |
| price | integer | 가격 (원) |
| category | text | 'sunglasses' / 'optical' / 'bluelight' |
| description | text | 제품 설명 |
| material | text | 소재 |
| sizes | text[] | 사이즈 배열 |
| colors | jsonb | ProductColor[] |
| images | text[] | 이미지 URL 배열 (Supabase Storage) |
| is_bestseller | boolean | 베스트셀러 여부 |
| created_at | timestamptz | 등록일 |

#### `cart_items` (장바구니)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | 항목 ID |
| user_id | uuid (FK → profiles) | 사용자 ID |
| product_id | uuid (FK → products) | 제품 ID |
| color | text | 선택 색상 |
| quantity | integer | 수량 |
| created_at | timestamptz | 추가일 |

#### `orders` (주문)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | 주문 ID |
| user_id | uuid (FK → profiles) | 사용자 ID |
| order_number | text (unique) | 주문 번호 (표시용) |
| shipping_name | text | 수령인 |
| shipping_phone | text | 연락처 |
| shipping_address | text | 배송 주소 |
| shipping_zip_code | text | 우편번호 |
| shipping_memo | text | 배송 메모 |
| payment_method | text | 결제 수단 |
| total_amount | integer | 총 결제 금액 |
| status | text | 'pending' / 'confirmed' / 'shipping' / 'delivered' |
| created_at | timestamptz | 주문일 |

#### `order_items` (주문 상세)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | 항목 ID |
| order_id | uuid (FK → orders) | 주문 ID |
| product_id | uuid (FK → products) | 제품 ID |
| color | text | 선택 색상 |
| quantity | integer | 수량 |
| price | integer | 주문 시점 가격 |

### 6.2 TypeScript 타입

```ts
interface Product {
  id: string;
  name: string;
  price: number;
  category: 'sunglasses' | 'optical' | 'bluelight';
  description: string;
  material: string;
  sizes: string[];
  colors: ProductColor[];
  images: string[];
  is_bestseller: boolean;
  created_at: string;
}

interface ProductColor {
  name: string;
  hex: string;
  image_index: number;
}

interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  color: string;
  quantity: number;
}

interface Order {
  id: string;
  user_id: string;
  order_number: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_zip_code: string;
  shipping_memo?: string;
  payment_method: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  color: string;
  quantity: number;
  price: number;
}

interface Profile {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  zip_code?: string;
  created_at: string;
}
```

### 6.3 Supabase Storage

- **버킷:** `product-images` (공개)
- **구조:** `products/{product_id}/{파일명}.webp`
- 제품 이미지를 Supabase Storage에 업로드하고 public URL 사용

### 6.4 Supabase Auth

- **Google OAuth** 로그인 (유일한 인증 수단)
- 최초 로그인 시 `profiles` 테이블에 자동 레코드 생성 (DB trigger)

### 6.5 Row Level Security (RLS)

| 테이블 | 정책 |
|--------|------|
| `products` | 누구나 읽기 가능 (SELECT) |
| `profiles` | 본인만 읽기/수정 가능 |
| `cart_items` | 본인 데이터만 CRUD |
| `orders` | 본인 주문만 읽기 가능 |
| `order_items` | 본인 주문의 항목만 읽기 가능 |

---

## 7. 상태 관리

- **인증 상태:** Supabase Auth 세션 기반, Context로 전역 관리
- **장바구니:** 로그인 사용자 → Supabase `cart_items` 테이블 / 비로그인 → localStorage
- **주문 데이터:** Supabase `orders` + `order_items` 테이블에 영구 저장

---

## 8. 반응형 브레이크포인트

| 구분 | 너비 |
|------|------|
| 모바일 | < 768px |
| 태블릿 | 768px ~ 1024px |
| 데스크톱 | > 1024px |

---

## 9. MVP 범위 외 (향후 확장)

- 실제 결제(PG) 연동
- 검색 기능
- 리뷰 / 별점
- 위시리스트
- 재고 관리
- 관리자 대시보드
- 가상 피팅 (AR)

---

## 10. 성공 기준 (MVP)

1. 회원가입/로그인 ~ 주문 완료까지 **전체 플로우가 끊김 없이 동작**한다
2. 모바일/데스크톱 모두에서 **깨지지 않는 반응형 레이아웃**
3. 애플 스타일의 **시각적 완성도** (여백, 타이포, 애니메이션)
4. Lighthouse 퍼포먼스 **80점 이상**
5. 마이페이지에서 **주문 내역 조회**가 가능하다
