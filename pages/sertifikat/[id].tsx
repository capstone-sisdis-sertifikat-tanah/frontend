import { Text } from "@tremor/react";
import { NotFoundPlaceholder } from "@/modules/template/not-found";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { SertifikatDetails } from "@/modules/sertifikat/sertifikat-details";
import { Sertifikat } from "@/modules/sertifikat/sertifikat-list";

export default function SertifikatDetailsPage() {
  const router = useRouter();

  const id = router.query.id as string;

  const { data: shipment, isLoading } = useSWR<{ data: Sertifikat }>(`/sertifikat/${id}`);

  if (!shipment && !isLoading) {
    return <NotFoundPlaceholder description="Maaf, sertifikat yang Anda cari tidak ditemukan." />;
  }

  return (
    <main>
      <h1 className="text-tremor-title font-semibold">Rincian Sertifikat</h1>
      <Text className="mt-0.5">Lihat rincian sertifikat yang terdaftar.</Text>

      <div className="mt-4">
        <SertifikatDetails details={shipment?.data} isLoading={isLoading} />
      </div>
    </main>
  );
}

SertifikatDetailsPage.title = "Rincian Sertifikat | Sistem Penerbitan Sertifikat Tanah";
