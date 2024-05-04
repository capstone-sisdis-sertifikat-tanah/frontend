import React from "react";
import { Button, Dialog, DialogPanel, Textarea } from "@tremor/react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@/hooks/use-mutation";
import { toast } from "sonner";
import { useOptimisticList } from "@/hooks/use-optimistic";
import dynamic from "next/dynamic";
import SearchLocation from "./search-location";
import { RefreshAddressButton } from "./refresh-address-button";

const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
});

type DaftarkanTanahPayload = {
  lat: string;
  lng: string;
  lokasi: string;
};

type DaftarkanTanahApiPayload = {
  lat: string;
  long: string;
  lokasi: string;
};

export function DaftarkanTanah() {
  const [isOpen, setIsOpen] = React.useState(false);
  const methods = useForm<DaftarkanTanahPayload>();

  const { register, handleSubmit, reset, resetField, control } = methods;

  const { trigger, isMutating } = useMutation<DaftarkanTanahApiPayload>("/sertifikat");

  const { mutate } = useOptimisticList("/sertifikat/pemilik");

  const onSubmit = async (payload: DaftarkanTanahPayload) => {
    try {
      const result = await trigger({
        lat: payload.lat.toString(),
        long: payload.lng.toString(),
        lokasi: payload.lokasi,
      });

      toast.success("Tanah baru telah didaftarkan.");

      await mutate(result.data.data);
      setIsOpen(false);
    } catch (error) {}
  };

  return (
    <FormProvider {...methods}>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        loading={isMutating}
        type="button"
        className="mt-2 rounded-tremor-small"
      >
        Mulai
      </Button>
      <Dialog
        open={isOpen}
        onClose={() => {
          if (isMutating) return;
          setIsOpen(false);
        }}
        static={true}
      >
        <DialogPanel className="sm:max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <SearchLocation
              onChange={({ lat, lng }) => {
                resetField("lat", {
                  defaultValue: lat,
                });
                resetField("lng", {
                  defaultValue: lng,
                });
              }}
            />

            <div className="mt-4 space-y-3">
              <Map>
                <div className="hidden">
                  <input readOnly {...register("lat")} placeholder="Latitude" required />
                  <input readOnly {...register("lng")} placeholder="Longitude" required />
                </div>
              </Map>
              <div className="relative flex items-end gap-2">
                <Controller
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="lokasi"
                      autoComplete="off"
                      spellCheck="false"
                      placeholder="Alamat Lengkap Divisi"
                      required
                    />
                  )}
                  name="lokasi"
                  defaultValue=""
                  control={control}
                />

                <RefreshAddressButton
                  onRefresh={(location) => {
                    resetField("lokasi", {
                      defaultValue: location,
                    });
                  }}
                />
              </div>
            </div>

            <Button loading={isMutating} type="submit" className="mt-4 w-full rounded-tremor-small">
              Daftarkan tanah
            </Button>
          </form>
        </DialogPanel>
      </Dialog>
    </FormProvider>
  );
}
