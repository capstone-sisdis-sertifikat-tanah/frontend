import React from "react";
import { FileInput } from "./file-input";
import { Button, Divider, Text } from "@tremor/react";
import { toast } from "sonner";
import { useMutation } from "@/hooks/use-mutation";
import { RiCheckboxCircleFill } from "@remixicon/react";
import { SertifikatDetails } from "@/modules/sertifikat/sertifikat-details";
import { Sertifikat } from "@/modules/sertifikat/sertifikat-list";

export function VerifikasiSertifikat() {
  const [pdfBlobUrl, setPdfBlobUrl] = React.useState<string | null>(null);

  const { trigger, data, isMutating, reset } = useMutation("/verify");

  const shipmentData = data?.data?.data?.data?.sertifikat as Sertifikat;

  return (
    <div className="mt-3 grid md:grid-cols-2 gap-4 md:h-[calc(100dvh-240px)]">
      <FileInput
        disabled={isMutating}
        onChange={(url) => {
          setPdfBlobUrl(url);
          if (!url) {
            reset();
          }
        }}
      />
      <Divider className="md:hidden" />
      <div className="border max-md:-mt-4 space-y-2 md:overflow-y-scroll md:px-4 pb-4 scrollbar">
        {pdfBlobUrl && data ? (
          <div className="px-4">
            <Text className="mt-4 text-xl font-medium text-black flex gap-2 items-center">
              Invoice perjalanan valid <RiCheckboxCircleFill className="text-emerald-600" />
            </Text>
            <SertifikatDetails details={shipmentData} isLoading={isMutating} />
          </div>
        ) : (
          <div className="max-md:h-44 grid place-items-center w-full h-full px-4">
            <Button
              className="w-full"
              loading={isMutating}
              variant="secondary"
              onClick={async () => {
                if (!pdfBlobUrl) {
                  toast.error("Mohon unggah file PDF terlebih dahulu.");
                  return;
                }

                try {
                  await trigger({
                    identifier: {
                      shipment: "4803efb126b0f844f559bb89812abccaa653afabe9d24c0dc570efd6af7dff7e",
                    },
                  });
                } catch (error) {}
              }}
            >
              Verifikasi Sertifikat
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
