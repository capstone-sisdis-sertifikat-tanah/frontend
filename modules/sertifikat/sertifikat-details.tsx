import React from "react";
import { LoadingDetailsPlaceholder } from "@/modules/template";
import { statuses } from "./sertifikat-list";
import clsx from "clsx";
import { RiAttachment2 } from "@remixicon/react";
import { Steps } from "@/components/steps";
import dynamic from "next/dynamic";

const ReadOnlyMap = dynamic(() => import("@/components/map/read-only-map"), {
  ssr: false,
});

export type SertifikatDetails = {
  id: string;
  idPemilik: string;
  akta: {
    id: string;
    idDokumen: string;
    status: "Approve" | "Menunggu Persetujuan";
    idPembeli: string;
    idPenjual: string;
    approvers: Array<string>;
    lat: string;
    long: string;
    TxId: Array<string>;
  };
  lat: string;
  long: string;
  lokasi: string;
};

function getStatus(details: SertifikatDetails) {
  const isAktaEmpty = !details.akta;

  if (isAktaEmpty) {
    return "pending";
  }

  return "valid";
}

function getSteps(details: SertifikatDetails) {
  const status = getStatus(details);

  const steps = [
    {
      name: "Tanah didaftarkan oleh pemilik",
      description: (
        <span>Tanah baru berhasil didaftarkan oleh pemilik. Belum terdaftar perpindahan sertifikat terkait.</span>
      ),
      status: "complete",
    },
  ] as {
    name: string;
    description: string | React.ReactNode;
    status: "complete" | "current" | "upcoming";
  }[];

  switch (status) {
    case "pending":
      return steps;

    case "valid":
      steps.push({
        name: "Sertifikat sedang berlangsung",
        description: <span>{/* Perjalanan sedang menuju divisi <b>{details.divisiPenerima.name}</b> */}</span>,
        status: "complete",
      });
      steps.push({
        name: "Sertifikat selesai",
        description: (
          <span>
            Perjalanan <b>{details.id}</b> telah selesai. Anda bisa melihat sertifikat perjalanan di bagian bawah
            halaman.
          </span>
        ),
        status: "complete",
      });
      return steps;

    default:
      return steps;
  }
}

export function SertifikatDetails({
  details,
  isLoading,
}: {
  details: SertifikatDetails | undefined;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <LoadingDetailsPlaceholder />;
  }

  if (!details) return null;

  const isAktaEmpty = !details.akta;

  return (
    <div>
      <dl className="divide-y divide-gray-100">
        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">Status</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
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
          </dd>
        </div>

        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">Riwayat Sertifikat</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            <Steps steps={getSteps(details)} />
          </dd>
        </div>

        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">Alamat Lengkap</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            <div className="sm:w-3/4">{details.lokasi}</div>

            <div className="mt-4">
              <ReadOnlyMap
                markerPosition={{
                  lat: parseFloat(details.lat),
                  lng: parseFloat(details.long),
                }}
              />
            </div>
          </dd>
        </div>

        {!isAktaEmpty && (
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Sertifikat Tanah</dt>
            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                  <div className="flex w-0 flex-1 items-center">
                    <RiAttachment2 className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                      <span className="truncate font-medium">sertifikat-tanah.pdf</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">{/* <SertifikatPDF identifier={details.id} /> */}</div>
                </li>
              </ul>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
