import React from "react";
import { LoadingDetailsPlaceholder } from "@/modules/template";
import { Sertifikat, statuses } from "./sertifikat-list";
import clsx from "clsx";
import { RiArrowRightUpLine, RiArticleLine, RiAttachment2 } from "@remixicon/react";
import { Steps } from "@/components/steps";
import dynamic from "next/dynamic";
import { useUser } from "@/hooks/use-user";
import { CreateDokumen } from "@/modules/dokumen";
import Link from "next/link";
import { AktaTanahResponse, AktaTanahStatus, statuses as aktaTanahStatuses, statusText } from "@/modules/akta-tanah";
import { SertifikatPDF } from "./sertifikat-pdf";
import { Avatar } from "@/components";
import useSWR from "swr";

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

function getSteps(history?: { data: Array<Sertifikat> }) {
  const steps =
    history?.data.map((sertifikat, index) => {
      const isAktaEmpty = !sertifikat.idAkta;
      const isLatest = index === 0;
      if (isAktaEmpty) {
        return {
          name: "Tanah didaftarkan oleh pemilik",
          description: (
            <span>Tanah baru berhasil didaftarkan oleh pemilik. Belum terdaftar perpindahan sertifikat terkait.</span>
          ),
          status: "complete",
        };
      }
      if (isLatest) {
        return {
          name: "Sertifikat tanah baru berhasil diterbitkan",
          description: (
            <span>
              Perpindahan sertifikat tanah berhasil dilakukan. Anda bisa mengunduh sertifikat tanah terkait di bagian
              bawah halaman.
            </span>
          ),
          status: "complete",
        };
      }
      return {
        name: "Sertifikat tanah berubah kepemilikan",
        description: (
          <span>
            Sertifikat tanah telah berpindah kepemilikan ke pengguna <b>{sertifikat.idPemilik}</b>. Lihat{" "}
            <a target="_blank" className="hover:underline text-tremor-brand" href={`/akta-tanah/${sertifikat.idAkta}`}>
              akta tanah terkait
            </a>{" "}
            untuk detail lebih lanjut.
          </span>
        ),
        status: "complete",
      };
    }) ?? [];

  return steps.reverse() as {
    name: string;
    description: string | React.ReactNode;
    status: "complete" | "current" | "upcoming";
  }[];
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

  const { data: aktaTanah, isLoading: isLoadingAkta } = useSWR<{ data: AktaTanahResponse }>(
    `/akta/${details?.akta.id}`
  );

  if (isLoading || isLoadingAkta) {
    return <LoadingDetailsPlaceholder />;
  }

  if (!details) return null;

  const isAktaEmpty = !details.akta;

  const isOwner = details.pemilik.id === id;
  const canDownload = isOwner || userType === "admin-bpn";

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="sertifikat-details absolute inset-0 w-full h-full hidden">
        <SertifikatDetailsComponent details={details} akta={aktaTanah?.data} />
      </div>

      <SertifikatDetailsComponent details={details} akta={aktaTanah?.data} real />

      {!isAktaEmpty && canDownload && (
        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 relative bg-white">
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
                <div className="ml-4 flex-shrink-0">
                  <SertifikatPDF id={details.id} />
                </div>
              </li>
            </ul>
          </dd>
        </div>
      )}

      {userType === "user" && <CreateDokumen details={details} />}
    </div>
  );
}

function SertifikatDetailsComponent({
  details,
  akta,
  real = false,
}: {
  details: SertifikatDetails;
  akta?: AktaTanahResponse;
  real?: boolean;
}) {
  const { data: sertifikatHistory } = useSWR<{ data: Array<Sertifikat> }>(`/sertifikat/history/${details?.id}`);

  const isAktaEmpty = !details.akta;

  return (
    <dl className={clsx("divide-y divide-gray-100", real && "relative bg-white z-10")}>
      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">Status</dt>
        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          <div className="py-2">
            <p
              className={clsx(
                isAktaEmpty ? statuses["pending"] : statuses["valid"],
                !real && "sertifikat-status",
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
          <Steps steps={getSteps(sertifikatHistory)} />
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

      {akta && (
        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 w-full">
          <dt className="text-sm font-medium leading-6 text-gray-900">Approver</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 flex flex-wrap gap-2.5">
            {/* Penjual */}
            <div className="flex justify-between gap-x-6 p-5 border shadow-sm rounded-md flex-1 min-w-[280px]">
              <div className="flex gap-x-4">
                <Avatar />
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    Penjual <span className="text-[11px] text-orange-600">(signature)</span>
                  </p>
                  <p className="text-xs leading-5 text-gray-500 line-clamp-4 break-all">{akta?.TxId}</p>
                </div>
              </div>
            </div>
            {/* Pemilik */}
            <div className="flex justify-between gap-x-6 p-5 border shadow-sm rounded-md flex-1 min-w-[280px]">
              <div className="flex gap-x-4">
                <Avatar />
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    Pembeli <span className="text-[11px] text-orange-600">(signature)</span>
                  </p>
                  <p className="text-xs leading-5 text-gray-500 line-clamp-4 break-all">{akta?.TxId}</p>
                </div>
              </div>
            </div>
          </dd>
        </div>
      )}
    </dl>
  );
}
