import { AktaTanahList } from "@/modules/akta-tanah/akta-tanah-list";
import { Text } from "@tremor/react";
import React from "react";

export default function AktaTanahPage() {
  return (
    <main>
      <h1 className="text-tremor-title font-semibold">Manajemen Akta Tanah</h1>
      <Text className="mt-0.5">Kelola akta tanah yang terdaftar di dalam sistem.</Text>

      <AktaTanahList />
    </main>
  );
}

AktaTanahPage.title = "Manajemen Akta Tanah | Sistem Penerbitan Sertifikat Tanah";
