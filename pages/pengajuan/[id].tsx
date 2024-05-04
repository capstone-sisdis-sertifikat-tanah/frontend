import { Text } from "@tremor/react";
import { NotFoundPlaceholder } from "@/modules/template";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { DokumenDetails } from "@/modules/dokumen";
import { DokumenDetailsResponse } from "@/modules/dokumen/types";

export default function PengajuanJualBeliDetailsPage() {
  const router = useRouter();

  const id = router.query.id as string;

  const { data: dokumen, isLoading } = useSWR<{ data: DokumenDetailsResponse }>(`/dokumen/${id}`);

  if (!dokumen && !isLoading) {
    return <NotFoundPlaceholder description="Maaf, dokumen pengajuan jual beli yang Anda cari tidak ditemukan." />;
  }

  return (
    <main>
      <h1 className="text-tremor-title font-semibold">Rincian Pengajuan Jual Beli</h1>
      <Text className="mt-0.5">Lihat rincian pengajuan jual beli terkait.</Text>

      <div className="mt-4">
        <DokumenDetails details={dokumen?.data} isLoading={isLoading} />
      </div>
    </main>
  );
}

PengajuanJualBeliDetailsPage.title = "Rincian Pengajuan Jual Beli Tanah | Sistem Penerbitan PengajuanJualBeli Tanah";
