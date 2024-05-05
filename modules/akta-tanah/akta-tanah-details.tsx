import React from "react";
import { LoadingDetailsPlaceholder } from "@/modules/template";
import { statuses, statusText } from "./akta-tanah-list";
import clsx from "clsx";
import { Steps } from "@/components/steps";
import { AktaTanahResponse } from "./types";
import { Avatar } from "@/components/avatar";
import { useUser } from "@/hooks/use-user";
import { AktaTanahApproval } from "./akta-tanah-approval";
import { Button } from "@tremor/react";
import { useRouter } from "next/navigation";

function getSteps(details: AktaTanahResponse) {
  const steps = [
    {
      name: "Pengajuan pembelian tanah telah disetujui",
      description: (
        <span>
          Pengajuan{" "}
          <a target="_blank" className="hover:underline text-tremor-brand" href={`/pengajuan/${details.dokumen.id}`}>
            {details.dokumen.id}
          </a>{" "}
          untuk pembelian tanah telah disetujui oleh bank dan notaris.
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
    case "Menunggu Persetujuan Penjual":
      steps.push({
        name: "Menunggu Persetujuan Penjual",
        description: <span>Menunggu persetujuan dari Penjual. Penjual akan memeriksa akta tanah terkait.</span>,
        status: "current",
      });
      return steps;

    case "Menunggu Persetujuan Pembeli":
      steps.push({
        name: "Akta tanah telah disetujui oleh Penjual",
        description: <span>Akta tanah telah disetujui oleh Penjual. Pembeli akan memeriksa akta tanah terkait.</span>,
        status: "complete",
      });
      steps.push({
        name: "Menunggu Persetujuan Pembeli",
        description: <span>Menunggu persetujuan dari Pembeli. Pembeli akan memeriksa akta tanah terkait.</span>,
        status: "current",
      });
      return steps;

    case "reject":
      steps.push({
        name: "Akta tanah ditolak",
        description: (
          <span>
            Akta tanah dengan sertifikat tanah{" "}
            <a
              target="_blank"
              className="hover:underline text-tremor-brand"
              href={`/sertifikat/${details.dokumen.idSertifikat}`}
            >
              {details.dokumen.idSertifikat}
            </a>{" "}
            telah ditolak oleh Penjual atau Pembeli.
          </span>
        ),
        status: "complete",
      });
      return steps;

    case "Approve":
      steps.push({
        name: "Akta tanah telah disetujui oleh Penjual",
        description: <span>Akta tanah telah disetujui oleh Penjual. Pembeli akan memeriksa akta tanah terkait.</span>,
        status: "complete",
      });
      steps.push({
        name: "Akta tanah telah disetujui oleh Pembeli",
        description: (
          <span>Akta tanah telah disetujui oleh Pembeli. Sertifikat tanah terkait akan diterbitkan oleh sistem.</span>
        ),
        status: "complete",
      });
      steps.push({
        name: "Akta tanah telah disetujui",
        description: (
          <span>
            Akta tanah dengan sertifikat tanah{" "}
            <a
              target="_blank"
              className="hover:underline text-tremor-brand"
              href={`/sertifikat/${details.dokumen.idSertifikat}`}
            >
              {details.dokumen.idSertifikat}
            </a>{" "}
            telah disetujui oleh Penjual dan Pembeli. Silahkan kunjungi halaman sertifikat tanah untuk melihat detail
            lebih lanjut.
          </span>
        ),
        status: "complete",
      });
      return steps;

    default:
      return steps;
  }
}

export function AktaTanahDetails({
  details,
  isLoading,
}: {
  details: AktaTanahResponse | undefined;
  isLoading: boolean;
}) {
  const {
    user: { id, userType },
  } = useUser();

  const router = useRouter();

  if (isLoading) {
    return <LoadingDetailsPlaceholder />;
  }

  if (!details) return null;

  const isRejected = details.status === "reject";

  const idSertifikat = details.dokumen.idSertifikat;

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
          <dt className="text-sm font-medium leading-6 text-gray-900">Riwayat Akta Tanah</dt>
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

      {userType === "user" && <AktaTanahApproval details={details} />}
      {userType === "user" && details.status === "Approve" && (
        <div className="flex justify-end">
          <Button
            onClick={() => router.push(`/sertifikat/${idSertifikat}`)}
            variant="secondary"
            className="rounded-tremor-small"
          >
            Lihat Sertifikat Tanah
          </Button>
        </div>
      )}
    </div>
  );
}
