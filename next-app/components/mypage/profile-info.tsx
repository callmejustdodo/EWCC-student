import type { Profile } from "@/types";

interface ProfileInfoProps {
  profile: Profile;
  email: string;
}

export function ProfileInfo({ profile, email }: ProfileInfoProps) {
  return (
    <div className="space-y-4 rounded-lg border p-6">
      <h2 className="text-lg font-semibold">프로필</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">이름</dt>
          <dd className="font-medium">{profile.name}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">이메일</dt>
          <dd className="font-medium">{email}</dd>
        </div>
        {profile.phone && (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">연락처</dt>
            <dd className="font-medium">{profile.phone}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
