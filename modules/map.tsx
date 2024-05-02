import { TextInput } from "@tremor/react";
import dynamic from "next/dynamic";
import { FormProvider, useForm } from "react-hook-form";

const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
});

export function MapDemo() {
  const methods = useForm({
    defaultValues: {
      lat: (-6.1754).toString(),
      lng: (106.8272).toString(),
    },
  });

  const { register } = methods;

  return (
    <div>
      <FormProvider {...methods}>
        <form action="">
          <div className="mt-4 space-y-3">
            <Map>
              <div className="mt-4 flex flex-col gap-2">
                <div className="">
                  <TextInput readOnly {...register("lat")} placeholder="Latitude" />
                </div>
              </div>

              <div className="mt-4 ">
                <TextInput readOnly {...register("lng")} placeholder="Longitude" />
              </div>
            </Map>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
