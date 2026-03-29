export const SHIPPING_FEE = 3000;
export const FREE_SHIPPING_THRESHOLD = 100000;

export const CATEGORIES = [
  { value: "all", label: "전체" },
  { value: "sunglasses", label: "선글라스" },
  { value: "optical", label: "안경" },
  { value: "bluelight", label: "블루라이트 차단" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "최신순" },
  { value: "price_asc", label: "가격 낮은순" },
  { value: "price_desc", label: "가격 높은순" },
] as const;
