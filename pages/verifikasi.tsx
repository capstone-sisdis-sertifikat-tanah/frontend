import React from "react";
import { Text } from "@tremor/react";
import { RiArrowGoBackLine } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { VerifikasiSertifikat } from "@/modules/verifikasi";

export default function Verifikasi() {
  const router = useRouter();

  return (
    <>
      <header className="sticky bg-white dark:bg-black inset-x-0 top-0 z-50 flex h-16 border-b border-gray-900/10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => {
              if (window.history?.length > 2) {
                router.back();
              } else {
                router.push("/login");
              }
            }}
            className="flex items-center gap-2 p-3 rounded-tremor-small text-tremor-content hover:bg-tremor-brand-faint hover:text-tremor-brand-subtle max-md:hidden"
          >
            <RiArrowGoBackLine className="w-4 h-4" />
          </button>
        </div>
      </header>
      <main className="min-h-dvh pt-4 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-tremor-title font-semibold">Verifikasi</h1>
        <Text className="mt-0.5">Verifikasi validitas sertifikat tanah.</Text>

        <div className="mt-4">
          <VerifikasiSertifikat />
        </div>
      </main>
    </>
  );
}

Verifikasi.title = "Verifikasi Sertifikat | Sistem Penerbitan Sertifikat Tanah";
