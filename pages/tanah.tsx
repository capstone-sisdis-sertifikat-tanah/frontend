import { Text } from "@tremor/react";
import React from "react";
import { TanahList } from "@/modules/tanah";

export default function ListTanahPage() {
  return (
    <main>
      <h1 className="text-tremor-title font-semibold">Daftar Tanah</h1>
      <Text className="mt-0.5">Semua tanah beserta lokasinya yang terdaftar dalam sistem.</Text>

      <TanahList />
    </main>
  );
}

ListTanahPage.title = "Daftar Tanah yang Terdaftar | Sistem Penerbitan Sertifikat Tanah";
