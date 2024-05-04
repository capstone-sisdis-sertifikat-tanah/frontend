import { Text } from "@tremor/react";
import React from "react";
import { SertifikatList } from "@/modules/sertifikat";

export default function SertifikatPage() {
  return (
    <main>
      <h1 className="text-tremor-title font-semibold">Manajemen Sertifikat</h1>
      <Text className="mt-0.5">Kelola sertifikat tanah yang Anda miliki.</Text>

      <SertifikatList />
    </main>
  );
}

SertifikatPage.title = "Manajemen sertifikat | Sistem Penerbitan Sertifikat Tanah";
