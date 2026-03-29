"use client";

const METHODS = [
  { value: "card", label: "신용카드" },
  { value: "naverpay", label: "네이버페이" },
] as const;

interface PaymentMethodProps {
  selected: string;
  onChange: (method: string) => void;
}

export function PaymentMethod({ selected, onChange }: PaymentMethodProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">결제 수단</h2>
      <div className="flex gap-3">
        {METHODS.map((method) => (
          <button
            key={method.value}
            onClick={() => onChange(method.value)}
            className={`flex-1 rounded-lg border p-4 text-center text-sm font-medium transition-colors ${
              selected === method.value
                ? "border-foreground bg-foreground/5"
                : "border-border hover:bg-muted"
            }`}
          >
            {method.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        * MVP 버전에서는 실제 결제가 진행되지 않습니다.
      </p>
    </div>
  );
}
