import { Text } from "@tremor/react";
import { NotFoundPlaceholder } from "@/modules/template/not-found";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { AktaTanahDetails } from "@/modules/akta-tanah/akta-tanah-details";
import { AktaTanahResponse } from "@/modules/akta-tanah";

export default function AktaTanahDetailsPage() {
  const router = useRouter();

  const id = router.query.id as string;

  const { data: aktaTanah, isLoading } = useSWR<{ data: AktaTanahResponse }>(`/akta/${id}`);

  if (!aktaTanah && !isLoading) {
    return <NotFoundPlaceholder description="Maaf, akta jual beli yang Anda cari tidak ditemukan." />;
  }

  return (
    <main>
      <h1 className="text-tremor-title font-semibold">Rincian akta jual beli</h1>
      <Text className="mt-0.5">Lihat rincian akta jual beli yang terdaftar.</Text>

      <div className="mt-4">
        <AktaTanahDetails details={aktaTanah?.data} isLoading={isLoading} />
      </div>
    </main>
  );
}

AktaTanahDetailsPage.title = "Rincian AktaTanah | Sistem Penerbitan AktaTanah Tanah";
