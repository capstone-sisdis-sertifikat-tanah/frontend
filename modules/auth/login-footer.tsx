import { RiArrowRightLine } from "@remixicon/react";
import Link from "next/link";

export function LoginFooter() {
  return (
    <footer className="relative shrink-0">
      <div className="space-y-4 text-sm text-gray-900 sm:flex sm:items-center sm:justify-center sm:space-x-4 sm:space-y-0">
        <p className="text-center sm:text-left">Belum memiliki akun?</p>
        <Link
          className="inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 text-slate-900 ring-1 ring-slate-900/10 hover:ring-slate-900/20 bg-white"
          href="/register"
        >
          <span className="flex items-center gap-1">
            Dapatkan akses
            <span aria-hidden="true">
              <RiArrowRightLine className="w-3.5 h-3.5" />
            </span>
          </span>
        </Link>
      </div>
    </footer>
  );
}
