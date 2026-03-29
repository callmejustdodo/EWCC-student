"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ShippingInfo {
  name: string;
  phone: string;
  address: string;
  zipCode: string;
  memo: string;
}

interface ShippingFormProps {
  value: ShippingInfo;
  onChange: (info: ShippingInfo) => void;
  errors: Partial<Record<keyof ShippingInfo, string>>;
}

export function ShippingForm({ value, onChange, errors }: ShippingFormProps) {
  const update = (field: keyof ShippingInfo, val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">배송 정보</h2>

      <div className="space-y-2">
        <Label htmlFor="name">수령인 *</Label>
        <Input
          id="name"
          value={value.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="홍길동"
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">연락처 *</Label>
        <Input
          id="phone"
          value={value.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="010-1234-5678"
        />
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="zipCode">우편번호 *</Label>
        <Input
          id="zipCode"
          value={value.zipCode}
          onChange={(e) => update("zipCode", e.target.value)}
          placeholder="12345"
        />
        {errors.zipCode && (
          <p className="text-xs text-destructive">{errors.zipCode}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">주소 *</Label>
        <Input
          id="address"
          value={value.address}
          onChange={(e) => update("address", e.target.value)}
          placeholder="서울시 강남구 테헤란로 123"
        />
        {errors.address && (
          <p className="text-xs text-destructive">{errors.address}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="memo">배송 메모</Label>
        <Input
          id="memo"
          value={value.memo}
          onChange={(e) => update("memo", e.target.value)}
          placeholder="부재 시 경비실에 맡겨주세요"
        />
      </div>
    </div>
  );
}
