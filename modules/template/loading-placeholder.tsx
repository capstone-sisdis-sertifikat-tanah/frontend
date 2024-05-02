import { loadingPlaceholder } from "@/lib";

export function LoadingPlaceholder({ amount = 6 }: { amount?: number }) {
  return (
    <ul className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {loadingPlaceholder(amount).map((index) => (
        <li key={index} className="flex justify-between gap-x-6 p-5 border shadow-sm rounded-md">
          <div className="flex min-w-0 gap-x-4">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div className="mt-1 space-y-2">
              <div className="h-3 w-20 rounded bg-gray-200"></div>
              <div className="h-3 w-20 rounded bg-gray-200"></div>
            </div>
          </div>
          <div className="block h-4 w-4 bg-gray-200 rounded"></div>
        </li>
      ))}
    </ul>
  );
}
