# Implementation Plan (MVP)

모든 설계 문서(PRD, User Stories, Screen Flows, Frontend/Backend Architecture)를 기반으로 작성한 단계별 구현 계획입니다.

---

## 구현 순서 개요

```
Phase 1: Supabase 인프라 설정
    ↓
Phase 2: 프론트엔드 기반 + 인증
    ↓
Phase 3: 제품 탐색 (랜딩 + 목록 + 상세)
    ↓
Phase 4: 장바구니
    ↓
Phase 5: 체크아웃 + 주문
    ↓
Phase 6: 마이페이지
    ↓
Phase 7: 폴리싱 + QA
```

---

## Phase 1: Supabase 인프라 설정

모든 기능의 기반이 되는 백엔드를 먼저 구성합니다.

### 1.1 데이터베이스 테이블 생성

| 순서 | 테이블 | 의존성 |
|------|--------|--------|
| 1 | `products` | 없음 |
| 2 | `profiles` | auth.users |
| 3 | `cart_items` | profiles, products |
| 4 | `orders` | profiles |
| 5 | `order_items` | orders, products |

### 1.2 RLS 정책 적용

| 테이블 | 정책 |
|--------|------|
| `products` | 누구나 SELECT |
| `profiles` | 본인만 SELECT/UPDATE |
| `cart_items` | 본인만 CRUD |
| `orders` | 본인만 SELECT/INSERT |
| `order_items` | 본인 주문만 SELECT/INSERT |

### 1.3 Functions & Triggers

- [ ] `handle_new_user()` — 최초 로그인 시 profiles 자동 생성 (Trigger)
- [ ] `generate_order_number()` — 주문번호 생성 (LS-YYYYMMDD-XXXX)
- [ ] `create_order()` — 주문 생성 RPC (장바구니 → 주문 변환 트랜잭션)

### 1.4 인덱스

- [ ] `idx_cart_items_user_id`
- [ ] `idx_orders_user_id`, `idx_orders_created_at`
- [ ] `idx_order_items_order_id`
- [ ] `idx_products_category`
- [ ] `idx_products_is_bestseller`

### 1.5 Auth 설정

- [ ] Google OAuth Provider 설정 (Google Cloud Console → Client ID/Secret)
- [ ] Redirect URL: `{SITE_URL}/auth/callback`
- [ ] Email 가입 비활성화

### 1.6 Storage

- [ ] `product-images` 버킷 생성 (Public)
- [ ] 제품별 이미지 업로드 (`products/{product_id}/`)

### 1.7 시드 데이터

- [ ] 8~12개 제품 데이터 INSERT (선글라스, 안경, 블루라이트 각 3~4개)
- [ ] 베스트셀러 3~4개 지정

**산출물:** Supabase 프로젝트 완전 구성, DB에 테스트 제품 데이터 존재

---

## Phase 2: 프론트엔드 기반 + 인증

레이아웃과 인증 시스템을 구축합니다. 이후 모든 Phase의 기반이 됩니다.

### 2.1 Supabase 클라이언트 설정

- [ ] `lib/supabase/client.ts` — 브라우저 클라이언트
- [ ] `lib/supabase/server.ts` — 서버 클라이언트
- [ ] `lib/supabase/middleware.ts` — 세션 갱신 헬퍼
- [ ] `.env.local` — 환경 변수 설정

### 2.2 타입 & 유틸리티

- [ ] `types/index.ts` — Product, CartItem, Order, Profile 타입 정의
- [ ] `types/supabase.ts` — Supabase 자동 생성 DB 타입
- [ ] `lib/constants.ts` — 배송비, 무료 배송 기준 등 상수
- [ ] `lib/format.ts` — 가격 포맷 (₩1,000) 유틸리티

### 2.3 인증

- [ ] `contexts/auth-context.tsx` — AuthProvider (user, profile, signInWithGoogle, signOut)
- [ ] `hooks/use-auth.ts` — 인증 상태 훅
- [ ] `middleware.ts` — Next.js 미들웨어 (세션 갱신 + 보호 라우트 가드)
- [ ] `app/login/page.tsx` — Google OAuth 로그인 페이지
- [ ] `app/auth/callback/route.ts` — OAuth 콜백 Route Handler
- [ ] `components/auth/google-login.tsx` — Google 로그인 버튼
- [ ] `components/auth/auth-guard.tsx` — 보호 라우트 래퍼

### 2.4 공통 레이아웃

- [ ] `app/layout.tsx` 수정 — AuthProvider + CartProvider 감싸기, Header + Footer 추가
- [ ] `components/layout/header.tsx` — 반응형 헤더 (로고, 메뉴, 장바구니 아이콘, 사용자 아이콘)
- [ ] `components/layout/mobile-drawer.tsx` — 모바일 햄버거 메뉴 드로어
- [ ] `components/layout/footer.tsx` — 푸터

### 2.5 shadcn/ui 컴포넌트 추가

- [ ] `input`, `select`, `badge`, `sheet`, `toast`, `separator`, `label` 등 필요 컴포넌트 설치

**산출물:** 로그인/로그아웃 동작, 헤더/푸터 레이아웃 완성, 보호 라우트 작동

**관련 스토리:** US-201, 202, 203, 204, 205, 301, 302

---

## Phase 3: 제품 탐색

랜딩 페이지, 제품 목록, 제품 상세 페이지를 구현합니다.

### 3.1 랜딩 페이지 (`/`)

- [ ] `app/page.tsx` — 서버에서 베스트셀러 fetch
- [ ] `components/home/hero-section.tsx` — 풀스크린 히어로 (이미지 + 카피 + CTA)
- [ ] `components/home/brand-section.tsx` — 브랜드 철학 소개
- [ ] `components/home/bestseller-section.tsx` — 베스트셀러 3~4개 카드

### 3.2 제품 목록 (`/products`)

- [ ] `app/products/page.tsx` — 서버에서 전체 제품 fetch
- [ ] `components/product/product-card.tsx` — 제품 카드 (이미지 + 이름 + 가격)
- [ ] `components/product/product-grid.tsx` — 반응형 그리드 (1~4열)
- [ ] `components/product/product-filter.tsx` — 카테고리 필터 (전체/선글라스/안경/블루라이트)
- [ ] `components/product/product-sort.tsx` — 정렬 (최신순/가격순)

### 3.3 제품 상세 (`/products/[id]`)

- [ ] `app/products/[id]/page.tsx` — 서버에서 제품 데이터 fetch
- [ ] `components/product/image-gallery.tsx` — 메인 이미지 + 썸네일 전환
- [ ] `components/product/color-swatch.tsx` — 컬러 선택 스와치
- [ ] `components/product/quantity-selector.tsx` — 수량 +/- 선택
- [ ] 관련 제품 추천 (같은 카테고리 2~3개)

**산출물:** 랜딩 → 제품 목록 → 제품 상세 전체 탐색 플로우 동작

**관련 스토리:** US-101, 102, 103, 401, 402, 403, 404, 501, 502, 503, 504, 505

---

## Phase 4: 장바구니

장바구니 Context와 페이지를 구현합니다.

### 4.1 장바구니 상태 관리

- [ ] `contexts/cart-context.tsx` — CartProvider (Supabase cart_items CRUD)
- [ ] `hooks/use-cart.ts` — addItem, updateQuantity, removeItem, clearCart

### 4.2 장바구니 담기 연동

- [ ] 제품 상세 "장바구니 담기" 버튼 → `addItem()` 호출
- [ ] 비로그인 시 `/login`으로 리다이렉트
- [ ] 담기 완료 피드백 (토스트 또는 뱃지 업데이트)
- [ ] 헤더 장바구니 아이콘 뱃지 연동 (`totalItems`)

### 4.3 장바구니 페이지 (`/cart`)

- [ ] `app/cart/page.tsx` — 장바구니 페이지
- [ ] `components/cart/cart-item.tsx` — 아이템 행 (이미지, 이름, 색상, 수량 +/-, 삭제)
- [ ] `components/cart/cart-summary.tsx` — 주문 요약 (소계, 배송비, 총액)
- [ ] `components/cart/empty-cart.tsx` — 빈 장바구니 안내 + "쇼핑하러 가기"

**산출물:** 제품 상세에서 장바구니 담기 → 장바구니 페이지에서 관리 가능

**관련 스토리:** US-303, 504, 601, 602, 603, 604, 605, 606

---

## Phase 5: 체크아웃 + 주문

주문 프로세스를 완성합니다.

### 5.1 체크아웃 페이지 (`/checkout`)

- [ ] `app/checkout/page.tsx` — 체크아웃 페이지
- [ ] `components/checkout/shipping-form.tsx` — 배송 정보 폼 (프로필 자동 입력)
- [ ] `components/checkout/payment-method.tsx` — 결제 수단 선택 (UI only)
- [ ] `components/checkout/order-review.tsx` — 최종 주문 요약
- [ ] 폼 유효성 검사 (필수 필드 체크)
- [ ] `create_order` RPC 호출 → 주문 생성

### 5.2 주문 완료 페이지 (`/order-complete`)

- [ ] `app/order-complete/page.tsx` — 주문 번호 + 내역 요약
- [ ] orderId로 Supabase에서 주문 조회
- [ ] "쇼핑 계속하기" 버튼 → `/products`

**산출물:** 장바구니 → 체크아웃 → 주문 완료 전체 플로우 동작

**관련 스토리:** US-701, 702, 703, 704, 705, 801, 802

---

## Phase 6: 마이페이지

주문 내역 조회와 프로필 확인 기능을 구현합니다.

### 6.1 마이페이지 (`/mypage`)

- [ ] `app/mypage/page.tsx` — 서버에서 주문 내역 fetch
- [ ] `components/mypage/order-list.tsx` — 주문 목록 (최신순, 펼치기/접기)
- [ ] `components/mypage/order-detail.tsx` — 주문 상세 (아이템 목록, 상태)
- [ ] `components/mypage/profile-info.tsx` — 프로필 정보 (이름, 이메일, 연락처)

**산출물:** 마이페이지에서 주문 내역 및 프로필 확인 가능

**관련 스토리:** US-901, 902

---

## Phase 7: 폴리싱 + QA

전체 완성도를 높이고 테스트합니다.

### 7.1 디자인 폴리싱

- [ ] 히어로 섹션 스크롤 애니메이션 (패럴럭스/페이드)
- [ ] 제품 카드 호버 트랜지션 (`hover:scale-[1.02]`)
- [ ] 페이지 전환 fade 애니메이션
- [ ] 여백, 타이포그래피, 간격 미세 조정
- [ ] 다크 모드 확인

### 7.2 반응형 검증

- [ ] 모바일 (< 768px) — 1~2열 그리드, 햄버거 메뉴, 터치 타겟 44px+
- [ ] 태블릿 (768~1024px) — 2~3열 그리드
- [ ] 데스크톱 (> 1024px) — 3~4열 그리드

### 7.3 에러 핸들링

- [ ] 네트워크 에러 시 사용자 피드백
- [ ] 존재하지 않는 제품 접근 시 404 처리
- [ ] 빈 장바구니로 체크아웃 접근 방지
- [ ] OAuth 실패 시 에러 메시지

### 7.4 전체 플로우 테스트

- [ ] **Flow 1:** 로그인 → 제품 탐색 → 장바구니 → 체크아웃 → 주문 완료
- [ ] **Flow 2:** 비로그인 → 장바구니 담기 시도 → 로그인 유도 → 복귀
- [ ] **Flow 3:** 베스트셀러 클릭 → 바로 구매
- [ ] **Flow 4:** 장바구니 수정 (수량 변경, 삭제)
- [ ] **Flow 5:** 주문 완료 → 쇼핑 계속하기
- [ ] **Flow 6:** 마이페이지 주문 내역 확인

### 7.5 성능

- [ ] Lighthouse 퍼포먼스 80점 이상
- [ ] 이미지 최적화 (WebP, next/image)
- [ ] 불필요한 번들 크기 확인

**산출물:** 전체 MVP 완성, 모든 플로우 검증 완료

---

## 의존성 다이어그램

```
Phase 1 (Supabase)
    │
    ▼
Phase 2 (레이아웃 + 인증) ←── shadcn/ui 컴포넌트 설치
    │
    ▼
Phase 3 (제품 탐색) ←── products 테이블 + Storage
    │
    ▼
Phase 4 (장바구니) ←── cart_items 테이블 + AuthContext
    │
    ▼
Phase 5 (체크아웃 + 주문) ←── orders 테이블 + create_order RPC
    │
    ▼
Phase 6 (마이페이지) ←── orders + order_items 데이터
    │
    ▼
Phase 7 (폴리싱 + QA)
```

---

## 파일 생성 체크리스트 (전체)

### `lib/` (5개)
- [ ] `lib/constants.ts`
- [ ] `lib/format.ts`
- [ ] `lib/supabase/client.ts`
- [ ] `lib/supabase/server.ts`
- [ ] `lib/supabase/middleware.ts`

### `types/` (2개)
- [ ] `types/index.ts`
- [ ] `types/supabase.ts`

### `contexts/` (2개)
- [ ] `contexts/auth-context.tsx`
- [ ] `contexts/cart-context.tsx`

### `hooks/` (2개)
- [ ] `hooks/use-auth.ts`
- [ ] `hooks/use-cart.ts`

### `app/` 페이지 (8개 + 1 Route Handler)
- [ ] `app/layout.tsx` (수정)
- [ ] `app/page.tsx` (수정)
- [ ] `app/products/page.tsx`
- [ ] `app/products/[id]/page.tsx`
- [ ] `app/cart/page.tsx`
- [ ] `app/checkout/page.tsx`
- [ ] `app/order-complete/page.tsx`
- [ ] `app/login/page.tsx`
- [ ] `app/mypage/page.tsx`
- [ ] `app/auth/callback/route.ts`

### `components/` (22개)
- [ ] `components/layout/header.tsx`
- [ ] `components/layout/mobile-drawer.tsx`
- [ ] `components/layout/footer.tsx`
- [ ] `components/home/hero-section.tsx`
- [ ] `components/home/brand-section.tsx`
- [ ] `components/home/bestseller-section.tsx`
- [ ] `components/product/product-card.tsx`
- [ ] `components/product/product-grid.tsx`
- [ ] `components/product/product-filter.tsx`
- [ ] `components/product/product-sort.tsx`
- [ ] `components/product/image-gallery.tsx`
- [ ] `components/product/color-swatch.tsx`
- [ ] `components/product/quantity-selector.tsx`
- [ ] `components/cart/cart-item.tsx`
- [ ] `components/cart/cart-summary.tsx`
- [ ] `components/cart/empty-cart.tsx`
- [ ] `components/checkout/shipping-form.tsx`
- [ ] `components/checkout/payment-method.tsx`
- [ ] `components/checkout/order-review.tsx`
- [ ] `components/auth/google-login.tsx`
- [ ] `components/auth/auth-guard.tsx`
- [ ] `components/mypage/order-list.tsx`
- [ ] `components/mypage/order-detail.tsx`
- [ ] `components/mypage/profile-info.tsx`

### 기타 (1개)
- [ ] `middleware.ts`
