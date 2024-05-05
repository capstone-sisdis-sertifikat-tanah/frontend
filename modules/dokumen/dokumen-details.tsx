import React from "react";
import { LoadingDetailsPlaceholder } from "@/modules/template";
import { statuses, statusText } from "./dokumen-list";
import clsx from "clsx";
import { Steps } from "@/components/steps";
import { DokumenDetailsResponse } from "./types";
import { Avatar } from "@/components/avatar";
import { useUser } from "@/hooks/use-user";
import { DokumenApproval } from "./dokumen-approval";
import { Button } from "@tremor/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { AktaTanah } from "../akta-tanah/akta-tanah-list";

function getSteps(details: DokumenDetailsResponse) {
  const steps = [
    {
      name: "Pengajuan diinisasi oleh pembeli",
      description: (
        <span>
          Pengajuan untuk pembelian tanah{" "}
          <a
            target="_blank"
            className="hover:underline text-tremor-brand"
            href={`/sertifikat/${details.sertifikat.id}`}
          >
            {details.sertifikat.id}
          </a>{" "}
          telah diajukan oleh pengguna <b>{details.pembeli.email}</b>.
        </span>
      ),
      status: "complete",
    },
  ] as {
    name: string;
    description: string | React.ReactNode;
    status: "complete" | "current" | "upcoming";
  }[];

  switch (details.status) {
    case "Menunggu Persetujuan Bank":
      steps.push({
        name: "Menunggu Persetujuan Bank",
        description: (
          <span>Menunggu persetujuan dari Bank. Bank akan memeriksa pengajuan pembelian tanah terkait.</span>
        ),
        status: "current",
      });
      return steps;

    case "Menunggu Persetujuan Notaris":
      steps.push({
        name: "Pengajuan pembelian tanah telah disetujui oleh Bank",
        description: (
          <span>
            Pengajuan untuk pembelian tanah telah disetujui oleh Bank. Notaris akan memeriksa pengajuan pembelian tanah
            terkait.
          </span>
        ),
        status: "complete",
      });
      steps.push({
        name: "Menunggu Persetujuan Notaris",
        description: (
          <span>Menunggu persetujuan dari Notaris. Notaris akan memeriksa pengajuan pembelian tanah terkait.</span>
        ),
        status: "current",
      });
      return steps;

    case "reject":
      steps.push({
        name: "Pengajuan pembelian tanah ditolak",
        description: (
          <span>
            Pengajuan untuk pembelian tanah{" "}
            <a
              target="_blank"
              className="hover:underline text-tremor-brand"
              href={`/sertifikat/${details.sertifikat.id}`}
            >
              {details.sertifikat.id}
            </a>{" "}
            telah ditolak oleh Bank atau Notaris.
          </span>
        ),
        status: "complete",
      });
      return steps;

    case "Approve":
      steps.push({
        name: "Pengajuan pembelian tanah telah disetujui oleh Bank",
        description: (
          <span>
            Pengajuan untuk pembelian tanah telah disetujui oleh Bank. Notaris akan memeriksa pengajuan pembelian tanah
            terkait.
          </span>
        ),
        status: "complete",
      });
      steps.push({
        name: "Pengajuan pembelian tanah telah disetujui oleh Notaris",
        description: (
          <span>
            Pengajuan untuk pembelian tanah telah disetujui oleh Notaris. Akta tanah terkait akan diterbitkan oleh
            sistem.
          </span>
        ),
        status: "complete",
      });
      steps.push({
        name: "Pengajuan pembelian tanah telah disetujui",
        description: (
          <span>
            Pengajuan untuk pembelian tanah{" "}
            <a
              target="_blank"
              className="hover:underline text-tremor-brand"
              href={`/sertifikat/${details.sertifikat.id}`}
            >
              {details.sertifikat.id}
            </a>{" "}
            telah disetujui oleh Bank dan Notaris. Pembeli dan Penjual dapat melanjutkan proses persetujuan akta tanah.
          </span>
        ),
        status: "complete",
      });
      return steps;

    default:
      return steps;
  }
}

export function DokumenDetails({
  details,
  isLoading,
}: {
  details: DokumenDetailsResponse | undefined;
  isLoading: boolean;
}) {
  const {
    user: { id, userType },
  } = useUser();

  const router = useRouter();

  const { data: aktaListByPembeli } = useSWR<{ data: Array<AktaTanah> }>(`/akta/pembeli/${id}`);
  const { data: aktaListByPenjual } = useSWR<{ data: Array<AktaTanah> }>(`/akta/penjual/${id}`);

  const aktaId =
    aktaListByPembeli?.data.find((akta) => akta.idDokumen === details?.id)?.id ??
    aktaListByPenjual?.data.find((akta) => akta.idDokumen === details?.id)?.id;

  if (isLoading) {
    return <LoadingDetailsPlaceholder />;
  }

  if (!details) return null;

  const isRejected = details.status === "reject";

  return (
    <div>
      <dl className="divide-y divide-gray-100">
        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">Status</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            <div className="py-2">
              <p
                className={clsx(
                  statuses[details.status],
                  "rounded-md w-fit mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                )}
              >
                {statusText[details.status]}
              </p>
            </div>
          </dd>
        </div>

        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">Riwayat Pengajuan</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            <Steps steps={getSteps(details)} isCanceled={isRejected} />
          </dd>
        </div>

        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">Pihak yang terlibat</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            <ul role="list" className="mt-4 grid sm:grid-cols-2 gap-4">
              {[details.pembeli, details.penjual].map((person, i) => (
                <li key={person.email} className="flex justify-between gap-x-6 p-5 border shadow-sm rounded-md">
                  <div className="flex gap-x-4 w-full">
                    <Avatar />
                    <div className="flex-1">
                      <p className="text-sm font-semibold leading-6 text-gray-900">{person.name}</p>
                      <p className="flex text-xs leading-5 text-gray-500">
                        <a href={`mailto:${person.email}`} className="truncate hover:underline">
                          {person.email}
                        </a>
                      </p>

                      <div className="mt-2 flex justify-end">
                        <div
                          className={clsx(
                            "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                            i === 0
                              ? "bg-orange-50 text-orange-700 ring-orange-700/10"
                              : "bg-green-50 text-green-700 ring-green-700/10"
                          )}
                        >
                          {i === 0 ? "Pembeli" : "Penjual"}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      {(userType === "bank" || userType === "notaris") && <DokumenApproval details={details} />}
      {userType === "user" && details.status === "Approve" && (
        <div className="flex justify-end">
          <Button
            onClick={() => router.push(`/akta-tanah/${aktaId}`)}
            variant="secondary"
            className="rounded-tremor-small"
          >
            Lihat Akta Tanah
          </Button>
        </div>
      )}
    </div>
  );
}
