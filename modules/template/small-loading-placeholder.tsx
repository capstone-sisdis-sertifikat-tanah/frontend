import { loadingPlaceholder } from "@/lib";

export function SmallLoadingPlaceholder({ amount = 1 }: { amount?: number }) {
  return (
    <ul className="mt-4 grid gap-4">
      {loadingPlaceholder(amount).map((index) => (
        <li key={index} className="mb-1 space-y-2 w-full">
          <div className="h-3 w-full rounded bg-gray-200"></div>
          <div className="h-3 w-full rounded bg-gray-200"></div>
        </li>
      ))}
    </ul>
  );
}
