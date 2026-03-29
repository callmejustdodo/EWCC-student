"use client";

import { SORT_OPTIONS } from "@/lib/constants";

interface ProductSortProps {
  selected: string;
  onChange: (value: string) => void;
}

export function ProductSort({ selected, onChange }: ProductSortProps) {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border bg-background px-3 py-1.5 text-sm"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
