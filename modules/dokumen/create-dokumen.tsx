import React from "react";
import { Button, DatePicker, Dialog, DialogPanel, NumberInput } from "@tremor/react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useMutation } from "@/hooks/use-mutation";
import { toast } from "sonner";
import { useOptimisticList } from "@/hooks/use-optimistic";
import { useUser } from "@/hooks/use-user";
import { Label } from "@/components/label";
import { getCurrentTime, getDateTime } from "@/lib";

type CreateDokumenPayload = {
  idSupplyChain: string;
  idDivisiPenerima: string;
  idTransportasi: string;
  beratMuatan: string;
  tanggalBerangkat: Date;
  waktuBerangkat: string;
};

type CreateDokumenApiPayload = {
  idSupplyChain: string;
  idDivisiPenerima: string;
  idTransportasi: string;
  beratMuatan: string;
  waktuBerangkat: Date;
};

export function CreateDokumen() {
  const [isOpen, setIsOpen] = React.useState(false);

  const {
    user: { id },
  } = useUser();

  const methods = useForm<CreateDokumenPayload>({
    shouldUnregister: true,
  });

  const { register, handleSubmit, reset, resetField, control, watch } = methods;

  const { trigger, isMutating } = useMutation<CreateDokumenApiPayload>("/dokumen");

  const { mutate } = useOptimisticList(`/dokumen/${id}`);

  const onSubmit = async (payload: CreateDokumenPayload) => {
    try {
      await trigger({
        ...payload,
        waktuBerangkat: getDateTime(payload.tanggalBerangkat, payload.waktuBerangkat),
      });

      toast.success("Perjalanan baru berhasil dibuat.");
      reset();

      setIsOpen(false);

      await mutate(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const isSameDate = watch("tanggalBerangkat")?.toDateString() === new Date().toDateString();

  return (
    <FormProvider {...methods}>
      <div className="mt-4 grid gap-3 sm:gap-2 sm:flex">
        <Button onClick={() => setIsOpen(true)} loading={isMutating} type="button" className="rounded-tremor-small">
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
          <DialogPanel className="sm:max-w-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input className="hidden" {...register("idSupplyChain")} value="" />

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-2">
                <div>
                  <Label htmlFor="beratMuatan" required>
                    Berat Muatan
                  </Label>
                  <NumberInput
                    {...register("beratMuatan")}
                    min={0}
                    id="beratMuatan"
                    placeholder="Contoh: 1000 (kg)"
                    required
                    className="mt-2 w-full rounded-tremor-small"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-2">
                <div>
                  <Label htmlFor="tanggalBerangkat" required>
                    Tanggal Berangkat
                  </Label>
                  <Controller
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        minDate={new Date()}
                        onValueChange={(value) => {
                          if (!value) {
                            resetField("tanggalBerangkat", {
                              defaultValue: undefined,
                            });
                          } else {
                            resetField("tanggalBerangkat", {
                              defaultValue: value,
                            });
                          }
                        }}
                        enableClear
                        placeholder="Pilih tanggal perjalanan"
                        className="mt-2 w-full rounded-tremor-small"
                      />
                    )}
                    name="tanggalBerangkat"
                    control={control}
                  />
                </div>
                <div>
                  <Label htmlFor="waktuBerangkat" required>
                    Waktu Berangkat
                  </Label>
                  <div className="mt-2">
                    <input
                      {...register("waktuBerangkat")}
                      className="text-gray-700 focus:ring-2 focus:ring-[#bfdbfe] transition duration-100 text-sm w-full border border-gray-200 focus:border-tremor-brand-subtle rounded-tremor-small"
                      type="time"
                      min={isSameDate ? getCurrentTime() : undefined}
                      required
                    />
                  </div>
                </div>
              </div>
              <Button loading={isMutating} type="submit" className="w-full rounded-tremor-small">
                Buat perjalanan baru
              </Button>
            </form>
          </DialogPanel>
        </Dialog>
      </div>
    </FormProvider>
  );
}
