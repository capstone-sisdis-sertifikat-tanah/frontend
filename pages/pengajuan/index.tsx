import { Text } from "@tremor/react";
import React from "react";
import { DokumenList } from "@/modules/dokumen/dokumen-list";

export default function PengajuanJualBeliPage() {
  return (
    <main>
      <h1 className="text-tremor-title font-semibold">Manajemen Pengajuan Jual Beli</h1>
      <Text className="mt-0.5">Kelola pengajuan jual beli tanah yang terdaftar di dalam sistem.</Text>

      <DokumenList />
    </main>
  );
}

PengajuanJualBeliPage.title = "Manajemen pengajuan jual beli | Sistem Penerbitan PengajuanJualBeli Tanah";
