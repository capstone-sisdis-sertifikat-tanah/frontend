import React from "react";
import { useDebounce } from "@/hooks/use-debounce";
import useSWRImmutable from "swr/immutable";
import { api } from "@/lib";
import { RiExpandUpDownLine, RiMapPinLine, RiSearchLine } from "@remixicon/react";
import { Combobox } from "@headlessui/react";
import clsx from "clsx";

type Place = {
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  displayName: {
    text: string;
    languageCode: string;
  };
};

type LocationSearchResult = {
  places: Place[];
};

export default function SearchLocation({
  onChange,
}: {
  onChange: (value: { lat: string; lng: string; location: string }) => void;
}) {
  const [value, setValue] = React.useState("");
  const keyword = useDebounce(value, 300);

  const { data: searchResults } = useSWRImmutable<{ data: LocationSearchResult }>(
    keyword ? `/search/${keyword}` : null,
    async () => {
      const locations = await api.post(
        "https://places.googleapis.com/v1/places:searchText",
        {
          textQuery: keyword,
          maxResultCount: 10,
          regionCode: "ID",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
            "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location",
          },
        }
      );

      return locations;
    },
    {
      keepPreviousData: true,
    }
  );

  const places = searchResults?.data?.places ?? [];

  return (
    <div className="relative z-10">
      <Combobox
        onChange={({
          location,
          displayName,
          formattedAddress,
        }: {
          location: Place["location"];
          displayName: string;
          formattedAddress: string;
        }) => {
          onChange({
            lat: location.latitude.toString(),
            lng: location.longitude.toString(),
            location: formattedAddress,
          });
          setValue(displayName);
        }}
      >
        <div className="relative rounded border">
          <RiSearchLine
            className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <Combobox.Input
            className="h-10 w-full border-0 bg-transparent pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Cari lokasi"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <RiExpandUpDownLine className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>
        </div>

        {places.length > 0 && keyword.length > 0 && (
          <Combobox.Options className="absolute w-full bg-[#ffffff] max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800">
            {places.map((place) => (
              <Combobox.Option
                key={place.formattedAddress}
                value={{
                  location: place.location,
                  displayName: place.displayName.text,
                  formattedAddress: place.formattedAddress,
                }}
                className={({ active }) =>
                  clsx("cursor-default select-none px-4 py-3 overflow-x-hidden", active && "bg-gray-100")
                }
              >
                <div className="flex items-center gap-2">
                  <RiMapPinLine className="shrink-0 text-gray-500 w-5 h-5" />
                  <div>
                    <span className="line-clamp-1">{place.displayName.text}</span>
                    <span className="line-clamp-1 text-xs text-gray-600">{place.formattedAddress}</span>
                  </div>
                </div>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}

        {keyword !== "" && places.length === 0 && (
          <p className="absolute w-full p-4 text-sm bg-[#ffffff] text-gray-500">
            Tidak ada hasil yang ditemukan untuk <b>{keyword}</b>
          </p>
        )}
      </Combobox>
    </div>
  );
}
