import React from "react";
import { useMutation } from "@/hooks/use-mutation";
import { useUser } from "@/hooks/use-user";
import { useOptimistic } from "@/hooks/use-optimistic";
import { Button } from "@tremor/react";
import { toast } from "sonner";
import { AktaTanah } from "./akta-tanah-list";

export function AktaTanahApproval({ details }: { details: AktaTanah }) {
  const { trigger, isMutating } = useMutation("/aktaTanah/complete");

  const { mutate } = useOptimistic(`/aktaTanah/${details?.id}`);

  const {
    user: { userType, id },
  } = useUser();

  // const isOwner = details.divisiPengirim.id === idDivisi;
  const isRejected = details.status === "Rejected";
  const isPending = details.status === "Need Approval" && new Date(details.waktuBerangkat) < new Date();
  const canApprove = userType === "bank" || userType === "notaris";
  const isApproved = details.status === "Completed";

  return (
    canApprove && (
      <div className="flex justify-end gap-2">
        {!isRejected && !isApproved && (
          <Button
            loading={isMutating}
            onClick={async () => {
              await trigger({
                id: details.id,
                status: "Rejected",
              });

              mutate({
                status: "Rejected",
              });

              toast.success("Anda membatalkan perjalanan.");
            }}
            className="rounded-tremor-small bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600"
          >
            Tolak
          </Button>
        )}
        {canApprove && (isPending || isApproved) && (
          <Button
            disabled={isApproved}
            loading={isMutating}
            onClick={async () => {
              await trigger({
                id: details.id,
                distance: 50,
                idApprover: id,
              });

              mutate({
                status: "Completed",
              });

              toast.success("Anda telah menyelesaikan perjalanan.");
            }}
            className="rounded-tremor-small"
          >
            {isPending && "Selesaikan Perjalanan"}
            {isApproved && "Perjalanan Selesai"}
          </Button>
        )}
      </div>
    )
  );
}
