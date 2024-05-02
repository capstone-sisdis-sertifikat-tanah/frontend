import { RiDeleteBinLine, RiFileLine } from "@remixicon/react";
import React from "react";
import { Text } from "@tremor/react";
import clsx from "clsx";

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function FileInput({ onChange, disabled = false }: { onChange: (blob: string) => void; disabled?: boolean }) {
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [fileSize, setFileSize] = React.useState<string | null>(null);
  const [blobUrl, setBlobUrl] = React.useState<string>("");

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;

    const file = files[0];

    const blob = new Blob([file], { type: file.type });
    const blobUrl = URL.createObjectURL(blob);

    onChange(blobUrl);
    setFileName(file.name);
    setFileSize(formatFileSize(file.size));
    setBlobUrl(blobUrl);
  }

  return (
    <div
      className={clsx(
        "border border-gray-400 border-dashed w-full",
        disabled && "cursor-not-allowed opacity-50",
        "max-md:min-h-80"
      )}
    >
      <div className={clsx("relative w-full h-full grid place-items-center", disabled && "pointer-events-none")}>
        <div className="grid place-items-center gap-2 w-full px-4">
          <RiFileLine className="w-10 h-10 text-gray-400" />
          <Text className="text-center">
            Pindah file ke sini atau <span className="font-medium text-tremor-brand">pilih file</span> untuk mengunggah
          </Text>
          {fileName && (
            <div className="mt-2 relative z-10 rounded-tremor-default border border-tremor-border bg-tremor-background p-4 shadow-tremor-input w-full max-w-sm">
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <button
                  disabled={disabled}
                  onClick={() => {
                    setFileName(null);
                    setFileSize(null);
                    setBlobUrl("");
                    onChange("");
                  }}
                  type="button"
                  className="rounded-tremor-small p-2 text-tremor-content-subtle hover:text-tremor-content"
                  aria-label="Remove file"
                >
                  <RiDeleteBinLine className="h-5 w-5 shrink-0" />
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-tremor-small bg-tremor-background-subtle">
                  <RiFileLine className="h-5 w-5 shrink-0 text-tremor-content-emphasis" />
                </span>
                <div className="pr-8 overflow-hidden">
                  <a
                    href={blobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-tremor-label font-medium text-tremor-brand line-clamp-1 hover:underline"
                  >
                    {fileName}
                  </a>
                  <p className="mt-0.5 text-tremor-label text-tremor-content">{fileSize}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <input
          disabled={disabled}
          type="file"
          accept="application/pdf"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileUpload}
        />
      </div>
      <div className="mt-2">
        <Text>
          Pastikan file merupakan format <b>.pdf</b>
        </Text>
      </div>
    </div>
  );
}
