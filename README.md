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
├── README.md                             # 프로젝트 소개 (이 파일)
├── docs/                                 # 설계 문서
│   ├── prd.md                            # 제품 요구사항 문서
│   ├── user_stories.md                   # 유저 스토리
│   ├── screen_list_and_user_flows.md     # 스크린 목록 & 유저 플로우
│   ├── frontend_architecture.md          # 프론트엔드 아키텍처
│   └── backend_architecture.md           # 백엔드 아키텍처 (Supabase)
│
└── next-app/                             # Next.js 애플리케이션
    │
    ├── app/                              # App Router — 라우트 & 페이지
    │   ├── layout.tsx                    # 루트 레이아웃 (Providers + Header + Footer)
    │   ├── page.tsx                      # / — 랜딩 페이지
    │   ├── globals.css                   # 글로벌 스타일 + CSS 변수
    │   ├── favicon.ico
    │   ├── products/
    │   │   ├── page.tsx                  # /products — 제품 목록
    │   │   └── [id]/
    │   │       └── page.tsx              # /products/:id — 제품 상세
    │   ├── cart/
    │   │   └── page.tsx                  # /cart — 장바구니
    │   ├── checkout/
    │   │   └── page.tsx                  # /checkout — 체크아웃
    │   ├── order-complete/
    │   │   └── page.tsx                  # /order-complete — 주문 완료
    │   ├── login/
    │   │   └── page.tsx                  # /login — Google OAuth 로그인
    │   ├── mypage/
    │   │   └── page.tsx                  # /mypage — 주문 내역 + 프로필
    │   └── auth/
    │       └── callback/
    │           └── route.ts              # OAuth 콜백 처리
    │
    ├── components/                       # 재사용 컴포넌트
    │   ├── ui/                           # shadcn/ui 기본 컴포넌트 (button 등)
    │   ├── layout/                       # 헤더, 푸터, 모바일 드로어
    │   ├── home/                         # 히어로, 브랜드 소개, 베스트셀러
    │   ├── product/                      # 제품 카드, 그리드, 필터, 갤러리
    │   ├── cart/                         # 장바구니 아이템, 요약
    │   ├── checkout/                     # 배송 폼, 결제 수단, 주문 요약
    │   ├── auth/                         # Google 로그인 버튼, 인증 가드
    │   ├── mypage/                       # 주문 내역, 프로필
    │   └── theme-provider.tsx            # 테마 Provider (next-themes)
    │
    ├── lib/                              # 유틸리티 & 설정
    │   ├── utils.ts                      # cn() 등 헬퍼
    │   ├── constants.ts                  # 배송비 등 상수
    │   ├── format.ts                     # 가격 포맷
    │   └── supabase/                     # Supabase 클라이언트 (browser/server)
    │
    ├── public/                           # 정적 파일 (이미지 등)
    ├── types/                            # TypeScript 타입 정의
    ├── hooks/                            # 커스텀 훅 (use-auth, use-cart)
    ├── contexts/                         # React Context (auth, cart)
    │
    ├── middleware.ts                      # 세션 갱신 + 라우트 가드
    ├── components.json                   # shadcn/ui 설정
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

## Documents

| 문서 | 설명 |
|------|------|
| [prd.md](docs/prd.md) | 제품 요구사항 정의 |
| [user_stories.md](docs/user_stories.md) | 유저 스토리 & 인수 조건 |
| [screen_list_and_user_flows.md](docs/screen_list_and_user_flows.md) | 스크린 목록 & 유저 플로우 다이어그램 |
| [frontend_architecture.md](docs/frontend_architecture.md) | 프론트엔드 아키텍처 설계 |
| [backend_architecture.md](docs/backend_architecture.md) | Supabase 백엔드 아키텍처 설계 |
