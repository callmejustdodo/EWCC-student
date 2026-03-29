"use client";

import { CATEGORIES } from "@/lib/constants";

interface ProductFilterProps {
  selected: string;
  onChange: (value: string) => void;
}

export function ProductFilter({ selected, onChange }: ProductFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            selected === cat.value
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
