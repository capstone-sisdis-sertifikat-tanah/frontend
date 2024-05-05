import React from "react";
import { useMutation } from "@/hooks/use-mutation";
import { useUser } from "@/hooks/use-user";
import { useOptimistic } from "@/hooks/use-optimistic";
import { Button } from "@tremor/react";
import { toast } from "sonner";
import { DokumenDetailsResponse, DokumenStatus } from "./types";

function getStatus(status: DokumenStatus): DokumenStatus {
  switch (status) {
    case "Menunggu Persetujuan Bank":
      return "Menunggu Persetujuan Notaris";
    case "Menunggu Persetujuan Notaris":
      return "Approve";
    default:
      return "Approve";
  }
}

export function DokumenApproval({ details }: { details: DokumenDetailsResponse }) {
  const { trigger, isMutating } = useMutation("/dokumen/approve");

  const { mutate } = useOptimistic(`/dokumen/${details?.id}`);

  const [isClicked, setIsClicked] = React.useState(false);

  const {
    user: { id, userType },
  } = useUser();

  const isTurnToApprove =
    (details.status === "Menunggu Persetujuan Bank" && userType === "bank") ||
    (details.status === "Menunggu Persetujuan Notaris" && userType === "notaris");

  const isRejected = details.status === "reject";
  const canApprove = !details.approvers.includes(id) && !isRejected && isTurnToApprove;
  const isApproved = details.approvers.includes(id);

  if (isRejected || isApproved || !canApprove) return null;

  return (
    <div className="flex justify-end gap-2 bg-white relative pb-6">
      {!isApproved && (
        <Button
          loading={isMutating}
          onClick={async () => {
            await trigger({
              id: details.id,
              status: "reject",
            });

            mutate({
              status: "reject",
            });

            toast.success("Pengajuan telah ditolak.");
          }}
          className="rounded-tremor-small bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600"
        >
          Tolak
        </Button>
      )}
      <Button
        className="rounded-tremor-small"
        disabled={!canApprove || isClicked}
        loading={isMutating}
        onClick={async () => {
          await trigger({
            id: details.id,
            status: "approve",
          });

          toast.success("Pengajuan telah disetujui.");

          await mutate({
            approvers: [...details.approvers, id],
            status: getStatus(details.status),
          });

          setIsClicked(true);
        }}
      >
        Setujui
      </Button>
    </div>
  );
}
