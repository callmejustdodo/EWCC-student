"use client";

import type { ProductColor } from "@/types";

interface ColorSwatchProps {
  colors: ProductColor[];
  selected: string;
  onChange: (colorName: string) => void;
}

export function ColorSwatch({ colors, selected, onChange }: ColorSwatchProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        색상: <span className="font-medium text-foreground">{selected}</span>
      </p>
      <div className="flex gap-2">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => onChange(color.name)}
            className={`h-8 w-8 rounded-full border-2 transition-all ${
              selected === color.name
                ? "border-foreground scale-110"
                : "border-transparent hover:scale-105"
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
}
