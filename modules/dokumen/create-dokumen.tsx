import React from "react";
import { SertifikatDetails } from "@/modules/sertifikat";
import { Button } from "@tremor/react";
import { useMutation } from "@/hooks/use-mutation";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import { useOptimisticList } from "@/hooks/use-optimistic";
import { Dokumen } from ".";
import useSWR from "swr";
import { AktaTanah } from "../akta-tanah";

export function CreateDokumen({ details }: { details: SertifikatDetails }) {
  const {
    user: { id },
  } = useUser();
  const { mutate } = useOptimisticList(`/dokumen/pembeli/${id}`);

  const { data: dokumen, isLoading } = useSWR<{ data: Array<Dokumen> }>(`/dokumen/pembeli/${id}`);
  const { data: akta, isLoading: isLoadingAkta } = useSWR<{ data: Array<AktaTanah> }>(`/akta/pembeli/${id}`);

  const [isClicked, setIsClicked] = React.useState(false);

  const { trigger, isMutating } = useMutation("/dokumen");

  const hasDiajukan =
    dokumen?.data.some(
      (dok) =>
        dok.idSertifikat === details.id &&
        ["Menunggu Persetujuan Bank", "Menunggu Persetujuan Notaris"].includes(dok.status)
    ) ||
    akta?.data.some((akta) =>
      dokumen?.data.some(
        (dok) =>
          dok.idSertifikat === details.id &&
          dok.id === akta.idDokumen &&
          ["Menunggu Persetujuan Pembeli", "Menunggu Persetujuan Penjual"].includes(akta.status)
      )
    );

  const isOwner = details.pemilik.id === id;

  if (isOwner) return null;

  return (
    <div className="flex justify-end gap-2 bg-white relative pb-6">
      <Button
        className="rounded-tremor-small"
        disabled={isLoading || isLoadingAkta || hasDiajukan || isClicked}
        loading={isMutating}
        onClick={async () => {
          const result = await trigger({
            idSertifikat: details.id,
            status: "Menunggu Persetujuan Bank",
            idPenjual: details.pemilik.id,
          });

          toast.success("Pembelian tanah telah diajukan.");

          await mutate(result);

          setIsClicked(true);
        }}
      >
        {hasDiajukan ? "Pembelian telah diajukan" : "Ajukan Pembelian"}
      </Button>
    </div>
  );
}
