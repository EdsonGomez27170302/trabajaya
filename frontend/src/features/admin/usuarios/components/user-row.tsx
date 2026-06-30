"use client";

import type { AdminUser } from "./users-table-types";
import { UserRowInfo } from "./user-row-info";
import { UserRowActions } from "./user-row-actions";

export function UserRow({
  user,
  onToggle,
  onVerify,
}: {
  user: AdminUser;
  onToggle: (user: AdminUser) => void;
  onVerify: (user: AdminUser) => void;
}) {
  const name = user.student_profile
    ? `${user.student_profile.first_name} ${user.student_profile.last_name}`
    : user.company_profile?.company_name ?? user.username;

  return (
    <div
      className={`flex flex-col gap-3 rounded-3xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between ${
        !user.is_active ? "border-red-100 opacity-60" : "border-border"
      }`}
    >
      <UserRowInfo user={user} name={name} />
      <UserRowActions user={user} onToggle={onToggle} onVerify={onVerify} />
    </div>
  );
}
