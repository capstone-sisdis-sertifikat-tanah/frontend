import useSWR from "swr";

import { EmptyPlaceholder, LoadingPlaceholder, SmallLoadingPlaceholder } from "@/modules/template";
import Link from "next/link";
import { Card } from "@tremor/react";
import { RiArrowRightUpLine, RiArticleLine } from "@remixicon/react";
import clsx from "clsx";
import { useUser } from "@/hooks/use-user";
import { SertifikatDetails } from "../sertifikat";

const placeholderProps = {
  title: "Pengajuan tidak ditemukan",
  description: "Setiap pengajuan pembelian/penjualan tanah akan tercatat disini.",
};

type DokumenStatus = "Menunggu Persetujuan Bank" | "Menunggu Persetujuan Notaris" | "Approve" | "reject";

export type Dokumen = {
  id: string;
  idSertifikat: string;
  status: DokumenStatus;
  idPembeli: string;
  idPenjual: string;
  approvers: Array<string>;
};

export const statuses = {
  "Menunggu Persetujuan Bank": "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
  "Menunggu Persetujuan Notaris": "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
  Approve: "text-green-700 bg-green-50 ring-green-600/20",
  reject: "text-red-700 bg-red-50 ring-red-600/20",
};

export const statusText = {
  "Menunggu Persetujuan Bank": "Menunggu Persetujuan Bank",
  "Menunggu Persetujuan Notaris": "Menunggu Persetujuan Notaris",
  Approve: "Disetujui",
  reject: "Ditolak",
};

export function DokumenList({
  type,
  status,
}: {
  type: "pembeli" | "penjual" | "all";
  status?: "Menunggu Persetujuan" | "Approve" | "reject";
}) {
  const {
    user: { id },
  } = useUser();

  const { data: dokumenData, isLoading } = useSWR<{ data: Array<Dokumen> }>(
    type === "all" ? "/dokumen" : `/dokumen/${type}/${id}`
  );

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  const data = dokumenData?.data.filter((dokumen) => (status ? dokumen.status.includes(status) : true)) ?? [];

  if (data.length === 0 || !data) {
    return <EmptyPlaceholder {...placeholderProps} />;
  }

  return (
    <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.map((dokumen) => {
        return (
          <Link href={`/pengajuan/${dokumen.id}`} key={dokumen.id}>
            <Card className="group px-4 pt-5 pb-1">
              <div className="flex space-x-2 items-center">
                <div className="p-2 shrink-0">
                  <RiArticleLine className="w-12 h-12 text-gray-600" />
                </div>
                <div className="mt-1 overflow-hidden">
                  <p className="line-clamp-2 text-xs">{dokumen.id}</p>
                  <LokasiTanah idSertifikat={dokumen.idSertifikat} />
                </div>
              </div>
              <div className="mt-2 grid place-items-end divide-x divide-tremor-border border-t border-tremor-border dark:divide-dark-tremor-border dark:border-dark-tremor-border">
                <div className="py-2">
                  <p
                    className={clsx(
                      statuses[dokumen.status],
                      "rounded-md w-fit mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                    )}
                  >
                    {statusText[dokumen.status]}
                  </p>
                </div>
              </div>
              <span
                className="pointer-events-none absolute right-4 top-4 text-tremor-content-subtle group-hover:text-tremor-content dark:text-dark-tremor-content-subtle group-hover:dark:text-dark-tremor-content"
                aria-hidden={true}
              >
                <RiArrowRightUpLine className="h-4 w-4" aria-hidden={true} />
              </span>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

function LokasiTanah({ idSertifikat }: { idSertifikat: string }) {
  const { data: sertifikat, isLoading: isLoadingSertifikat } = useSWR<{ data: SertifikatDetails }>(
    `/sertifikat/${idSertifikat}`
  );

  if (isLoadingSertifikat) {
    return <SmallLoadingPlaceholder />;
  }

  return <p className="mt-1 line-clamp-2 pr-4 text-xs text-tremor-content">{sertifikat?.data.lokasi}</p>;
}
