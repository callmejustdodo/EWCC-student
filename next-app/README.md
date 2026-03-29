# LENS - 안경 브랜드 웹사이트

애플 스타일의 미니멀한 디자인으로 안경 제품을 브라우징하고 주문할 수 있는 웹사이트입니다.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI:** shadcn/ui (radix-nova) + Radix UI
- **Icons:** Hugeicons
- **Backend:** Supabase (Auth, PostgreSQL, Storage)
- **Auth:** Google OAuth (via Supabase Auth)

## Repository Structure

```
EWCC-student/
│
├── prd.md                                # 제품 요구사항 문서
├── user_stories.md                       # 유저 스토리
├── screen_list_and_user_flows.md         # 스크린 목록 & 유저 플로우
├── frontend_architecture.md              # 프론트엔드 아키텍처
├── backend_architecture.md               # 백엔드 아키텍처 (Supabase)
│
└── next-app/                             # Next.js 애플리케이션
    │
    ├── app/                              # App Router — 라우트 & 페이지
    │   ├── layout.tsx                    # 루트 레이아웃 (Providers + Header + Footer)
    │   ├── page.tsx                      # / — 랜딩 페이지
    │   ├── globals.css                   # 글로벌 스타일 + CSS 변수
    │   │
    │   ├── products/
    │   │   ├── page.tsx                  # /products — 제품 목록
    │   │   └── [id]/
    │   │       └── page.tsx              # /products/:id — 제품 상세
    │   │
    │   ├── cart/
    │   │   └── page.tsx                  # /cart — 장바구니
    │   │
    │   ├── checkout/
    │   │   └── page.tsx                  # /checkout — 체크아웃
    │   │
    │   ├── order-complete/
    │   │   └── page.tsx                  # /order-complete — 주문 완료
    │   │
    │   ├── login/
    │   │   └── page.tsx                  # /login — Google OAuth 로그인
    │   │
    │   ├── mypage/
    │   │   └── page.tsx                  # /mypage — 주문 내역 + 프로필
    │   │
    │   └── auth/
    │       └── callback/
    │           └── route.ts              # OAuth 콜백 처리 (Route Handler)
    │
    ├── components/                       # 재사용 컴포넌트
    │   ├── ui/                           # shadcn/ui 기본 컴포넌트
    │   │   ├── button.tsx
    │   │   ├── input.tsx
    │   │   ├── select.tsx
    │   │   ├── badge.tsx
    │   │   ├── sheet.tsx
    │   │   ├── toast.tsx
    │   │   └── ...
    │   │
    │   ├── layout/                       # 공통 레이아웃
    │   │   ├── header.tsx                # 반응형 헤더 (로고 + 메뉴 + 아이콘)
    │   │   ├── mobile-drawer.tsx         # 모바일 슬라이드 메뉴
    │   │   └── footer.tsx                # 푸터
    │   │
    │   ├── home/                         # 랜딩 페이지 섹션
    │   │   ├── hero-section.tsx          # 풀스크린 히어로
    │   │   ├── brand-section.tsx         # 브랜드 소개
    │   │   └── bestseller-section.tsx    # 베스트셀러 추천
    │   │
    │   ├── product/                      # 제품 관련
    │   │   ├── product-card.tsx          # 제품 카드 (재사용)
    │   │   ├── product-grid.tsx          # 제품 그리드
    │   │   ├── product-filter.tsx        # 카테고리 필터
    │   │   ├── product-sort.tsx          # 정렬
    │   │   ├── image-gallery.tsx         # 이미지 갤러리
    │   │   ├── color-swatch.tsx          # 컬러 선택
    │   │   └── quantity-selector.tsx     # 수량 선택
    │   │
    │   ├── cart/                         # 장바구니 관련
    │   │   ├── cart-item.tsx             # 장바구니 아이템 행
    │   │   ├── cart-summary.tsx          # 주문 요약
    │   │   └── empty-cart.tsx            # 빈 장바구니 안내
    │   │
    │   ├── checkout/                     # 체크아웃 관련
    │   │   ├── shipping-form.tsx         # 배송 정보 폼
    │   │   ├── payment-method.tsx        # 결제 수단 선택 (UI only)
    │   │   └── order-review.tsx          # 주문 최종 요약
    │   │
    │   ├── auth/                         # 인증 관련
    │   │   ├── google-login.tsx          # Google OAuth 버튼
    │   │   └── auth-guard.tsx            # 보호 라우트 래퍼
    │   │
    │   ├── mypage/                       # 마이페이지 관련
    │   │   ├── order-list.tsx            # 주문 내역 목록
    │   │   ├── order-detail.tsx          # 주문 상세 (펼치기)
    │   │   └── profile-info.tsx          # 프로필 정보
    │   │
    │   └── theme-provider.tsx            # 테마 Provider
    │
    ├── lib/                              # 유틸리티 & 설정
    │   ├── utils.ts                      # cn() 등 헬퍼
    │   ├── constants.ts                  # 배송비, 무료배송 기준 등 상수
    │   ├── format.ts                     # 가격 포맷 등
    │   └── supabase/
    │       ├── client.ts                 # 브라우저 Supabase 클라이언트
    │       ├── server.ts                 # 서버 Supabase 클라이언트
    │       └── middleware.ts             # 세션 갱신 헬퍼
    │
    ├── types/                            # 타입 정의
    │   ├── index.ts                      # Product, CartItem, Order, Profile
    │   └── supabase.ts                   # Supabase 자동 생성 DB 타입
    │
    ├── hooks/                            # 커스텀 훅
    │   ├── use-auth.ts                   # 인증 상태
    │   └── use-cart.ts                   # 장바구니 CRUD
    │
    ├── contexts/                         # React Context
    │   ├── auth-context.tsx              # 인증 Provider
    │   └── cart-context.tsx              # 장바구니 Provider
    │
    ├── middleware.ts                      # Next.js 미들웨어 (세션 갱신 + 라우트 가드)
    ├── next.config.mjs
    ├── tsconfig.json
    ├── postcss.config.mjs
    ├── eslint.config.mjs
    ├── .prettierrc
    └── package.json
```

## Getting Started

```bash
cd next-app
npm install
npm run dev
```

## Environment Variables

`next-app/.env.local` 파일에 다음 변수를 설정합니다:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 개발 서버 실행 (Turbopack) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run format` | Prettier 포맷팅 |
| `npm run typecheck` | TypeScript 타입 검사 |

## Adding shadcn/ui Components

```bash
npx shadcn@latest add button
```

`components/ui/` 디렉토리에 컴포넌트가 추가됩니다.
