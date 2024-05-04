import React from "react";
import { LoadingDetailsPlaceholder } from "../template/loading-details-placeholder";
import { getReadableDateTime } from "@/lib";
import clsx from "clsx";
import { RiArrowRightUpLine, RiAttachment2, RiCarLine } from "@remixicon/react";
import { Steps } from "@/components/steps";
import { useUser } from "@/hooks/use-user";

export type Shipment = {
  id: string;
  idSupplyChain: string;

  status: "Need Approval" | "Completed" | "Rejected";
  waktuBerangkat: string;
  waktuSampai: string;
  beratMuatan: number;
  emisiKarbon: number;
  TxId: string;
  approver: string;
};

export const statuses = {
  "Need Approval": "text-yellow-800 bg-yellow-50 ring-yellow-600/20 border-yellow-600/20",
  Completed: "text-green-700 bg-green-50 ring-green-600/20 border-green-600/20",
  Rejected: "text-red-700 bg-red-50 ring-red-600/20 border-red-600/20",
};

export const statusText = {
  "Need Approval": "Dalam Perjalanan",
  Completed: "Perjalanan Selesai",
  Rejected: "Perjalanan Dibatalkan",
};

function getSteps(details: Shipment) {
  const isWaitingBerangkat = new Date(details?.waktuBerangkat) > new Date() && details?.status === "Need Approval";

  const steps = [
    {
      name: "Perjalanan dibuat",
      description: (
        <span>
          Perjalanan <b>{details.id}</b> menuju divisi akan berangkat pada{" "}
          <b>{getReadableDateTime(details?.waktuBerangkat)}</b>
        </span>
      ),
      status: "complete",
    },
  ] as {
    name: string;
    description: string | React.ReactNode;
    status: "complete" | "current" | "upcoming";
  }[];

  switch (details?.status) {
    case "Rejected":
      if (!isWaitingBerangkat) {
        steps.push({
          name: "Perjalanan sedang berlangsung",
          description: <span>Perjalanan sedang menuju divisi</span>,
          status: "complete",
        });
      }

      steps.push({
        name: "Perjalanan dibatalkan",
        description: <span>Perjalanan menuju divisi telah dibatalkan oleh divisi </span>,
        status: "complete",
      });

      return steps;

    case "Completed":
      steps.push({
        name: "Perjalanan sedang berlangsung",
        description: <span>Perjalanan sedang menuju divisi</span>,
        status: "complete",
      });
      steps.push({
        name: "Perjalanan selesai",
        description: (
          <span>
            Perjalanan <b>{details.id}</b> telah selesai. Anda bisa melihat invoice perjalanan di bagian bawah halaman.
          </span>
        ),
        status: "complete",
      });
      return steps;

    case "Need Approval":
      if (!isWaitingBerangkat) {
        steps.push({
          name: "Perjalanan sedang berlangsung",
          description: <span>Perjalanan sedang menuju divisi</span>,
          status: "current",
        });
      } else {
        steps.push({
          name: "Perjalanan sedang menunggu waktu berangkat",
          description: (
            <span>
              Perjalanan akan menuju divisi pada <b>{getReadableDateTime(details?.waktuBerangkat)}</b>
            </span>
          ),
          status: "current",
        });
      }

      return steps;

    default:
      return steps;
  }
}

export function DummyDetails({ details, isLoading }: { details: Shipment | undefined; isLoading: boolean }) {
  if (isLoading) {
    return <LoadingDetailsPlaceholder />;
  }

  if (!details) return null;

  const isApproved = details?.status === "Completed";

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="shipment-details absolute inset-0 w-full h-full hidden">
        <DummyDetailsComponent details={details} />
      </div>

      <DummyDetailsComponent details={details} real />

      {isApproved && (
        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 bg-white relative">
          <dt className="text-sm font-medium leading-6 text-gray-900">Invoice</dt>
          <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
              <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                <div className="flex w-0 flex-1 items-center">
                  <RiAttachment2 className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                  <div className="ml-4 flex min-w-0 flex-1 gap-2">
                    <span className="truncate font-medium">invoice_perjalanan.pdf</span>
                  </div>
                </div>
              </li>
            </ul>
          </dd>
        </div>
      )}
    </div>
  );
}

export function DummyDetailsComponent({ details, real = false }: { details: Shipment; real?: boolean }) {
  const isWaitingBerangkat = new Date(details?.waktuBerangkat) > new Date() && details?.status === "Need Approval";

  const isCanceled = details?.status === "Rejected";
  const carbonEmission = details?.emisiKarbon.toLocaleString("id-ID", {
    style: "decimal",
    maximumFractionDigits: 2,
  });

  return (
    <dl className={clsx("divide-y divide-gray-100", real && "relative bg-white z-10")}>
      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">Status</dt>
        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          <p
            className={clsx(
              statuses[details?.status],
              !real && "shipment-status",
              "rounded-md w-fit my-1.5 px-1.5 py-0.5 text-xs font-medium border"
            )}
          >
            {isWaitingBerangkat ? "Menunggu Waktu Berangkat" : statusText[details?.status]}
          </p>
        </dd>
      </div>
      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">Riwayat Perjalanan</dt>
        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          <Steps steps={getSteps(details)} isCanceled={isCanceled} />
        </dd>
      </div>
      {details?.waktuSampai && (
        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">Waktu Sampai</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            {getReadableDateTime(details?.waktuSampai)}
          </dd>
        </div>
      )}
      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">Berat Muatan</dt>
        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          {details?.beratMuatan.toLocaleString("id-ID")} kg
        </dd>
      </div>
      {details?.emisiKarbon > 0 && (
        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900">Emisi Karbon</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            {carbonEmission} <b>kgCO2e</b>
          </dd>
        </div>
      )}
      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">Kendaraan</dt>
        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          <div className="group relative sm:max-w-sm border shadow-sm rounded-md">
            <div className="group px-4 py-5">
              <div className="w-full flex items-center min-w-0 gap-x-4">
                <RiCarLine className="shrink-0 w-10 h-10 text-gray-500" />
                <div>
                  <p className="text-sm font-semibold leading-6 text-gray-900">Lorem Ipsum</p>
                  <p className="flex text-xs leading-5 text-gray-500">
                    <span>Lorem</span>
                    <span className="mx-1">•</span>
                    <span>9999 KM</span>
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
          </div>
        </dd>
      </div>
    </dl>
  );
}
