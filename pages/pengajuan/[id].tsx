import { Text } from "@tremor/react";
import { NotFoundPlaceholder } from "@/modules/template";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { Dokumen, DokumenDetails } from "@/modules/dokumen";

export default function PengajuanJualBeliDetailsPage() {
  const router = useRouter();

  const id = router.query.id as string;

  const { data: shipment, isLoading } = useSWR<{ data: Dokumen }>(`/pengajuanJualBeli/${id}`);

  if (!shipment && !isLoading) {
    return <NotFoundPlaceholder description="Maaf, pengajuanJualBeli yang Anda cari tidak ditemukan." />;
  }

  return (
    <main>
      <h1 className="text-tremor-title font-semibold">Rincian Pengajuan Jual Beli</h1>
      <Text className="mt-0.5">Lihat rincian pengajuan jual beli yang terdaftar.</Text>

      <div className="mt-4">
        <DokumenDetails details={shipment?.data} isLoading={isLoading} />
      </div>
    </main>
  );
}

PengajuanJualBeliDetailsPage.title = "Rincian Pengajuan Jual Beli | Sistem Penerbitan PengajuanJualBeli Tanah";
