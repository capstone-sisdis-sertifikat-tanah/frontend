import React from "react";
import { SertifikatDetails } from "@/modules/sertifikat";
import { Button } from "@tremor/react";
import { useMutation } from "@/hooks/use-mutation";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import { useOptimisticList } from "@/hooks/use-optimistic";
import { Dokumen } from ".";
import useSWR from "swr";

export function CreateDokumen({ details }: { details: SertifikatDetails }) {
  const {
    user: { id },
  } = useUser();
  const { mutate } = useOptimisticList(`/dokumen/pembeli/${id}`);

  const { data, isLoading } = useSWR<{ data: Array<Dokumen> }>(`/dokumen/pembeli/${id}`);
  const [isClicked, setIsClicked] = React.useState(false);

  const { trigger, isMutating } = useMutation("/dokumen");

  const hasDiajukan = data?.data.some(
    (dokumen) =>
      dokumen.idSertifikat === details.id &&
      ["Menunggu Persetujuan Bank", "Menunggu Persetujuan Notaris"].includes(dokumen.status)
  );

  const isOwner = details.pemilik.id === id;

  if (isOwner) return null;

  return (
    <div className="flex justify-end gap-2 bg-white relative pb-6">
      <Button
        className="rounded-tremor-small"
        disabled={isLoading || hasDiajukan || isClicked}
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
