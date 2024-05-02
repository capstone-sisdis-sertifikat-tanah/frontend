import React from "react";
import { Text } from "@tremor/react";
import { VerifikasiSertifikat } from "@/modules/verifikasi/verifikasi-sertifikat";

export default function Verifikasi() {
  return (
    <main>
      <h1 className="text-tremor-title font-semibold">Verifikasi</h1>
      <Text className="mt-0.5">Verifikasi validitas sertifikat tanah.</Text>

      <div className="mt-4">
        <VerifikasiSertifikat />
      </div>
    </main>
  );
}

Verifikasi.title = "Verifikasi Sertifikat | Sistem Penerbitan Sertifikat Tanah";
