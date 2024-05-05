import React from "react";
import { LoadingDetailsPlaceholder } from "@/modules/template";
import { statuses } from "./sertifikat-list";
import clsx from "clsx";
import { RiArrowRightUpLine, RiArticleLine, RiAttachment2 } from "@remixicon/react";
import { Steps } from "@/components/steps";
import dynamic from "next/dynamic";
import { useUser } from "@/hooks/use-user";
import { CreateDokumen } from "@/modules/dokumen";
import Link from "next/link";
import { AktaTanahStatus, statuses as aktaTanahStatuses, statusText } from "@/modules/akta-tanah";

const ReadOnlyMap = dynamic(() => import("@/components/map/read-only-map"), {
  ssr: false,
});

export type SertifikatDetails = {
  id: string;
  akta: {
    id: string;
    idDokumen: string;
    status: AktaTanahStatus;
    idPembeli: string;
    idPenjual: string;
    approvers: Array<string>;
    lat: string;
    long: string;
    TxId: Array<string>;
  };
  pemilik: {
    id: string;
    email: string;
    name: string;
    role: "user";
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
        name: "Menunggu pengajuan pembelian tanah",
        description: (
          <span>
            Sertifikat tanah belum memiliki riwayat perpindahan. Menunggu pengajuan pembelian tanah dan persetujuan akta
            tanah.
          </span>
        ),
        status: "complete",
      });
      steps.push({
        name: "Sertifikat tanah diterbitkan",
        description: (
          <span>
            Sertifikat tanah <b>{details.id}</b> telah diterbitkan. Anda bisa mengunduh sertifikat tanah terkait di
            bagian bawah halaman.
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
  const {
    user: { id, userType },
  } = useUser();

  if (isLoading) {
    return <LoadingDetailsPlaceholder />;
  }

  if (!details) return null;

  const isAktaEmpty = !details.akta;

  const isOwner = details.pemilik.id === id;
  const canDownload = isOwner || userType === "admin-bpn";

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
                {isAktaEmpty ? "Tanah Baru" : "Sertifikat Valid"}
              </p>
            </div>
          </dd>
        </div>

        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">Pemilik</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            <a href={`mailto:${details.pemilik.email}`} className="truncate hover:underline text-tremor-brand">
              {details.pemilik.email}
            </a>
          </dd>
        </div>

        {details.akta && (
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Akta Tanah</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <div className="group relative sm:max-w-sm border shadow-sm rounded-md">
                <Link href={`/akta-tanah/${details.akta.id}`}>
                  <div className="group px-4 py-5">
                    <div className="w-full flex items-center min-w-0 gap-x-4">
                      <RiArticleLine className="shrink-0 w-10 h-10 text-gray-500" />
                      <div className="w-full pr-6">
                        <p className="text-xs leading-6 text-gray-900">{details.akta.id}</p>
                        <p
                          className={clsx(
                            aktaTanahStatuses[details.akta.status],
                            "rounded-md w-fit mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                          )}
                        >
                          {statusText[details.akta.status]}
                        </p>
                      </div>
                    </div>
                    <span
                      className="pointer-events-none absolute right-4 top-4 text-tremor-content-subtle group-hover:text-tremor-content dark:text-dark-tremor-content-subtle group-hover:dark:text-dark-tremor-content"
                      aria-hidden={true}
                    >
                      <RiArrowRightUpLine className="h-4 w-4" aria-hidden={true} />
                    </span>
                  </div>
                </Link>
              </div>
            </dd>
          </div>
        )}

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

        {!isAktaEmpty && canDownload && (
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

      {userType === "user" && <CreateDokumen details={details} />}
    </div>
  );
}
