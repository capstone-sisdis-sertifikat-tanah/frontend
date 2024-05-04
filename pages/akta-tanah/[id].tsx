import { Text } from "@tremor/react";
import { NotFoundPlaceholder } from "@/modules/template/not-found";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { AktaTanahDetails } from "@/modules/akta-tanah/akta-tanah-details";
import { AktaTanah } from "@/modules/akta-tanah/akta-tanah-list";

export default function AktaTanahDetailsPage() {
  const router = useRouter();

  const id = router.query.id as string;

  const { data: shipment, isLoading } = useSWR<{ data: AktaTanah }>(`/akta/${id}`);

  if (!shipment && !isLoading) {
    return <NotFoundPlaceholder description="Maaf, akta tanah yang Anda cari tidak ditemukan." />;
  }

  return (
    <main>
      <h1 className="text-tremor-title font-semibold">Rincian akta tanah</h1>
      <Text className="mt-0.5">Lihat rincian akta tanah yang terdaftar.</Text>

      <div className="mt-4">
        <AktaTanahDetails details={shipment?.data} isLoading={isLoading} />
      </div>
    </main>
  );
}

AktaTanahDetailsPage.title = "Rincian AktaTanah | Sistem Penerbitan AktaTanah Tanah";
