import useSWR from "swr";

import { EmptyPlaceholder, LoadingPlaceholder } from "@/modules/template";
import Link from "next/link";
import { Card } from "@tremor/react";
import { RiArrowRightUpLine, RiArticleLine } from "@remixicon/react";
import clsx from "clsx";
import { Sertifikat, statuses } from "@/modules/sertifikat";

const placeholderProps = {
  title: "Tanah tidak ditemukan",
  description: "Setiap tanah yang terdaftar akan ditampilkan disini.",
};

export function TanahList() {
  const { data, isLoading } = useSWR<{ data: Array<Sertifikat> }>("/sertifikat");

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
                  <p className="line-clamp-2 pr-4 text-xs text-tremor-content dark:text-dark-tremor-content">
                    {sertifikat.lokasi}
                  </p>
                  <p className="mt-1 truncate text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    {parseFloat(sertifikat.lat).toFixed(2)}
                    {", "} {parseFloat(sertifikat.long).toFixed(2)}
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
                    {isAktaEmpty ? "Tanah Baru" : "Sertifikat Valid"}
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
