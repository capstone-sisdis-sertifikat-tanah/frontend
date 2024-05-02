import useSWR from "swr";

import { EmptyPlaceholder } from "../template/empty-placeholder";
import { LoadingPlaceholder } from "../template/loading-placeholder";
import { useUser } from "@/hooks/use-user";
import Link from "next/link";
import { Card } from "@tremor/react";
import { RiArrowRightUpLine, RiTruckLine } from "@remixicon/react";
import { getReadableDateTime } from "@/lib";
import clsx from "clsx";

const placeholderProps = {
  title: "Sertifikat tidak ditemukan",
  description: "Setiap sertifikat tanah akan tercatat disini.",
};

export type Sertifikat = {
  id: string;
  idPerusahaan: string;
  idSupplyChain: string;
  status: "Need Approval" | "Completed" | "Rejected";
  waktuBerangkat: string;
  waktuSampai: string;
  beratMuatan: number;
  emisiKarbon: number;
};

export const statuses = {
  "Need Approval": "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
  Completed: "text-green-700 bg-green-50 ring-green-600/20",
  Rejected: "text-red-700 bg-red-50 ring-red-600/20",
};

export const statusText = {
  "Need Approval": "Dalam Perjalanan",
  Completed: "Perjalanan Selesai",
  Rejected: "Perjalanan Dibatalkan",
};

export function SertifikatList() {
  const {
    user: { id },
  } = useUser();

  const { data, isLoading } = useSWR<{ data: Array<Sertifikat> }>(`/sertifikat/pemilik/${id}`);

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  if (data?.data.length === 0 || !data) {
    return <EmptyPlaceholder {...placeholderProps} />;
  }

  return (
    <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.data.map((sertifikat) => {
        const isWaitingBerangkat =
          new Date(sertifikat.waktuBerangkat) > new Date() && sertifikat.status === "Need Approval";

        return (
          <Link href={`/sertifikat/${sertifikat.id}`} key={sertifikat.id}>
            <Card className="group px-4 pt-5 pb-1">
              <div className="flex space-x-2 items-center">
                <div className="p-2 shrink-0">
                  <RiTruckLine className="w-12 h-12 text-gray-600" />
                </div>
                <div className="mt-1 overflow-hidden">
                  <p className="truncate text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    {getReadableDateTime(sertifikat.waktuBerangkat)}
                  </p>
                  <p className="mt-1 line-clamp-1 text-xs text-tremor-content dark:text-dark-tremor-content">
                    {sertifikat.beratMuatan} kg
                  </p>
                </div>
              </div>
              <div className="mt-2 grid place-items-end divide-x divide-tremor-border border-t border-tremor-border dark:divide-dark-tremor-border dark:border-dark-tremor-border">
                <div className="py-2">
                  <p
                    className={clsx(
                      statuses[sertifikat.status],
                      "rounded-md w-fit mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                    )}
                  >
                    {isWaitingBerangkat ? "Menunggu Waktu Berangkat" : statusText[sertifikat.status]}
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
