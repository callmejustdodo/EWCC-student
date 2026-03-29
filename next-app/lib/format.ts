export function formatPrice(price: number): string {
  return `₩${price.toLocaleString("ko-KR")}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
