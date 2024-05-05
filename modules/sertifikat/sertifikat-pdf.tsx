import { useMutation } from "@/hooks/use-mutation";
import { Button } from "@tremor/react";
import React from "react";
import { toast } from "sonner";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const doc = new jsPDF("p", "mm", "a4");

export function SertifikatPDF({ id }: { id: string }) {
  const { trigger, data, isMutating } = useMutation(`/sertifikat/identifier/${id}`);

  const downloadPDF = async (identifier: string) => {
    const capture = document.querySelector(".sertifikat-details") as HTMLElement;
    const status = document.querySelector(".sertifikat-status") as HTMLElement;

    // Set fixed width and height for the captured component
    capture.style.width = "853px"; // Example width
    capture.style.height = "1279px"; // Example height
    capture.style.display = "block";

    status.style.paddingTop = "0px";
    status.style.paddingBottom = "10px";

    // Increase the DPI for clearer image
    const dpi = 300; // Example DPI
    const scale = dpi / 96; // 96 DPI is the default browser resolution
    const options = {
      scale: scale,
      useCORS: true, // Allow cross-origin images
      logging: false, // Disable logging to console
    };

    html2canvas(capture, options).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1.0); // Set quality to 1.0 for maximum quality

      doc.setProperties({
        title: identifier,
      });

      doc.setDocumentProperties({
        title: identifier,
      });

      // Adjust PDF dimensions based on the fixed component size
      const pdfWidth = 230; // A4 width in mm
      const pdfHeight = 257; // A4 height in mm
      const imgWidth = 170; // Example width in mm
      const imgHeight = (imgWidth * capture.offsetHeight) / capture.offsetWidth;

      // Center the image horizontally
      const offsetX = (pdfWidth - imgWidth) / 2;
      const offsetY = (pdfHeight - imgHeight) / 2;

      doc.addImage(imgData, "PNG", offsetX, offsetY, imgWidth, imgHeight, "", "FAST");
      doc.save("sertifikat-tanah.pdf");

      // Restore original component dimensions after capturing
      capture.style.width = "100%";
      capture.style.height = "100%";
      capture.style.display = "none";

      status.style.paddingTop = "2px";
      status.style.paddingBottom = "2px";
    });
  };

  return (
    <>
      <Button
        variant="light"
        loading={isMutating}
        className="font-medium text-tremor-brand hover:text-tremor-brand-emphasis"
        onClick={async () => {
          try {
            if (!data) {
              const response = await trigger();
              const identifier = response?.data?.data?.sertifikat as string;
              console.log(identifier);
              downloadPDF(identifier);
            } else {
              const identifier = data?.data?.sertifikat as string;
              console.log(identifier);
              downloadPDF(identifier);
            }
          } catch (e) {
            toast.error("Gagal memuat sertifikat.");
          }
        }}
      >
        Unduh
      </Button>
    </>
  );
}
