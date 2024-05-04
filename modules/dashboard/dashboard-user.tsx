import React from "react";
import { Divider, Text } from "@tremor/react";
import { Info } from "@/components/info";
import { SertifikatList, DaftarkanTanah } from "@/modules/sertifikat";

const info = {
  title: "Buat Sertifikat Tanah",
  description: "Daftarkan sertifikat tanah yang Anda miliki ke dalam sistem.",
};

export default function DashboardUser() {
  return (
    <main>
      <h1 className="text-tremor-title font-semibold">Manajemen Sertifikat</h1>
      <Text className="mt-0.5">Kelola sertifikat tanah Anda yang terdaftar di dalam sistem.</Text>

      <div className="mt-8 space-y-8">
        <div>
          <Info {...info} />
          <DaftarkanTanah />
        </div>

        <Divider />

        <div>
          <Info title="Sertifikat Anda" />
          <SertifikatList />
        </div>
      </div>
    </main>
  );
}
