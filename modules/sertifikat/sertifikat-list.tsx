import useSWR from "swr";

import { EmptyPlaceholder, LoadingPlaceholder } from "@/modules/template";
import Link from "next/link";
import { Card } from "@tremor/react";
import { RiArrowRightUpLine, RiArticleLine } from "@remixicon/react";
import { getReadableDateTime } from "@/lib";
import clsx from "clsx";

const placeholderProps = {
  title: "Sertifikat tidak ditemukan",
  description: "Setiap sertifikat tanah akan tercatat disini.",
};

export type Sertifikat = {
  id: string;
  idPemilik: string;
  idAkta: string;
  lat: string;
  long: string;
  lokasi: string;
};

export const statuses = {
  pending: "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
  valid: "text-green-700 bg-green-50 ring-green-600/20",
};

export const statusText = {
  "Need Approval": "Dalam Perjalanan",
  Completed: "Perjalanan Selesai",
  Rejected: "Perjalanan Dibatalkan",
};

export function SertifikatList() {
  const { data, isLoading } = useSWR<{ data: Array<Sertifikat> }>("/sertifikat/pemilik");

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  if (data?.data.length === 0 || !data) {
    return <EmptyPlaceholder {...placeholderProps} />;
  }

  return (
    <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.data.map((sertifikat) => {
        const isAktaEmpty = !sertifikat.idAkta;
        return (
          <Link href={`/sertifikat/${sertifikat.id}`} key={sertifikat.id}>
            <Card className="group px-4 pt-5 pb-1">
              <div className="flex space-x-2 items-center">
                <div className="p-2 shrink-0">
                  <RiArticleLine className="w-12 h-12 text-gray-600" />
                </div>
                <div className="mt-1 overflow-hidden">
                  <p className="truncate text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    {sertifikat.lokasi}
                  </p>
                  <p className="mt-1 line-clamp-1 text-xs text-tremor-content dark:text-dark-tremor-content">
                    {sertifikat.lat}
                    {", "} {sertifikat.long}
                  </p>
                </div>
              </div>
              <div className="mt-2 grid place-items-end divide-x divide-tremor-border border-t border-tremor-border dark:divide-dark-tremor-border dark:border-dark-tremor-border">
                <div className="py-2">
                  <p
                    className={clsx(
                      isAktaEmpty ? statuses["pending"] : statuses["valid"],
                      "rounded-md w-fit mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                    )}
                  >
                    {isAktaEmpty ? "Sertifikat Baru" : "Sertifikat Valid"}
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
