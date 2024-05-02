import { RiUserLine } from "@remixicon/react";

export function Avatar() {
  return (
    <div className="rounded-full w-10 h-10 shrink-0 grid place-items-center p-2 border bg-tremor-brand-faint border-tremor-brand-muted">
      <RiUserLine className="h-5 w-5 text-tremor-brand-subtle" />
    </div>
  );
}
