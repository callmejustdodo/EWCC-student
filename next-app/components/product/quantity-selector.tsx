"use client";

import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
}

export function QuantitySelector({
  quantity,
  onChange,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
      >
        -
      </Button>
      <span className="w-8 text-center text-sm font-medium">{quantity}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onChange(quantity + 1)}
      >
        +
      </Button>
    </div>
  );
}
