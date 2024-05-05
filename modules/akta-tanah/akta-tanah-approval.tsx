import React from "react";
import { useMutation } from "@/hooks/use-mutation";
import { useUser } from "@/hooks/use-user";
import { useOptimistic } from "@/hooks/use-optimistic";
import { Button } from "@tremor/react";
import { toast } from "sonner";
import { AktaTanahResponse, AktaTanahStatus } from "./types";

function getStatus(status: AktaTanahStatus): AktaTanahStatus {
  switch (status) {
    case "Menunggu Persetujuan Penjual":
      return "Menunggu Persetujuan Pembeli";
    case "Menunggu Persetujuan Pembeli":
      return "Approve";
    default:
      return "Approve";
  }
}

export function AktaTanahApproval({ details }: { details: AktaTanahResponse }) {
  const { trigger, isMutating } = useMutation("/akta/approve");

  const { mutate } = useOptimistic(`/akta/${details?.id}`);

  const [isClicked, setIsClicked] = React.useState(false);

  const {
    user: { id },
  } = useUser();

  const isTurnToApprove =
    (details.status === "Menunggu Persetujuan Penjual" && details.penjual.id === id) ||
    (details.status === "Menunggu Persetujuan Pembeli" && details.pembeli.id === id);

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

            toast.success("Akta tanah telah ditolak.");
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

          toast.success("Akta tanah telah disetujui.");

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
