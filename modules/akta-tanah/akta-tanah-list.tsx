import useSWR from "swr";

import { EmptyPlaceholder, LoadingPlaceholder, SmallLoadingPlaceholder } from "@/modules/template";
import Link from "next/link";
import { Card } from "@tremor/react";
import { RiArrowRightUpLine, RiArticleLine } from "@remixicon/react";
import clsx from "clsx";
import { useUser } from "@/hooks/use-user";
import { DokumenDetailsResponse } from "@/modules/dokumen";
import { AktaTanahStatus } from "./types";

const placeholderProps = {
  title: "Akta tanah tidak ditemukan",
  description: "Setiap akta tanah yang terdaftar akan ditampilkan disini.",
};

export type AktaTanah = {
  id: string;
  idDokumen: string;
  status: AktaTanahStatus;
  idPembeli: string;
  idPenjual: string;
  approvers: [];
};

export const statuses = {
  "Menunggu Persetujuan Pembeli": "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
  "Menunggu Persetujuan Penjual": "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
  Approve: "text-green-700 bg-green-50 ring-green-600/20",
  reject: "text-red-700 bg-red-50 ring-red-600/20",
  "Sudah Tidak Berlaku": "text-gray-700 bg-gray-50 ring-gray-600/20",
};

export const statusText = {
  "Menunggu Persetujuan Pembeli": "Menunggu Persetujuan Pembeli",
  "Menunggu Persetujuan Penjual": "Menunggu Persetujuan Penjual",
  Approve: "Disetujui",
  reject: "Ditolak",
  "Sudah Tidak Berlaku": "Sudah Tidak Berlaku",
};

export function AktaTanahList({
  type,
  status,
}: {
  type: "pembeli" | "penjual" | "all";
  status?: "Menunggu Persetujuan" | "Approve" | "reject";
}) {
  const {
    user: { id },
  } = useUser();

  const { data: aktaData, isLoading } = useSWR<{ data: Array<AktaTanah> }>(
    type === "all" ? "/akta" : `/akta/${type}/${id}`
  );

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  const data = aktaData?.data.filter((akta) => (status ? akta.status.includes(status) : true)) ?? [];

  if (data.length === 0 || !data) {
    return <EmptyPlaceholder {...placeholderProps} />;
  }

  return (
    <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.map((aktaTanah) => {
        return (
          <Link href={`/akta-tanah/${aktaTanah.id}`} key={aktaTanah.id}>
            <Card className="group px-4 pt-5 pb-1">
              <div className="flex space-x-2 items-center">
                <div className="p-2 shrink-0">
                  <RiArticleLine className="w-12 h-12 text-gray-600" />
                </div>
                <div className="mt-1 overflow-hidden">
                  <p className="line-clamp-2 text-xs">{aktaTanah.id}</p>
                  <LokasiTanah idDokumen={aktaTanah.idDokumen} />
                </div>
              </div>
              <div className="mt-2 grid place-items-end divide-x divide-tremor-border border-t border-tremor-border dark:divide-dark-tremor-border dark:border-dark-tremor-border">
                <div className="py-2">
                  <p
                    className={clsx(
                      statuses[aktaTanah.status],
                      "rounded-md w-fit mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                    )}
                  >
                    {statusText[aktaTanah.status]}
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

function LokasiTanah({ idDokumen }: { idDokumen: string }) {
  const { data: dokumen, isLoading: isLoadingDokumen } = useSWR<{ data: DokumenDetailsResponse }>(
    `/dokumen/${idDokumen}`
  );

  if (isLoadingDokumen) {
    return <SmallLoadingPlaceholder />;
  }

  return <p className="mt-1 line-clamp-2 pr-4 text-xs text-tremor-content">{dokumen?.data.sertifikat.lokasi}</p>;
}
