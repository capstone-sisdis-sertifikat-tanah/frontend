import React from "react";
import { RiRefreshLine } from "@remixicon/react";
import clsx from "clsx";
import { useFormContext } from "react-hook-form";

export function RefreshAddressButton({ onRefresh }: { onRefresh: (newAddress: string) => void }) {
  const [isLoading, setIsLoading] = React.useState(false);

  const { getValues } = useFormContext();

  const lat = getValues("lat");
  const lng = getValues("lng");

  return (
    <button
      onClick={async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          );

          const data = await response.json();

          const newAddress = data?.results?.[0]?.formatted_address;
          if (newAddress) {
            onRefresh(newAddress);
          }
        } catch (error) {
        } finally {
          setIsLoading(false);
        }
      }}
      className="shrink-0"
      disabled={isLoading}
    >
      <RiRefreshLine className={clsx("text-gray-400 hover:text-tremor-brand-subtle", isLoading && "animate-spin")} />
    </button>
  );
}
