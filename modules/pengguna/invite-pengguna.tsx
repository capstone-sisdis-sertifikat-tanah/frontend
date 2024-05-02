import React from "react";
import { Button, Select, SelectItem, TextInput } from "@tremor/react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@/hooks/use-mutation";
import { toast } from "sonner";
import { useOptimisticList } from "@/hooks/use-optimistic";

type InviteUserPayload = {
  username: string;
  email: string;
  organizationName: "User";
  role: "bank" | "notaris" | "user";
};

export function InviteUser() {
  const { register, handleSubmit, reset, control } = useForm<InviteUserPayload>();

  const { trigger, isMutating } = useMutation<InviteUserPayload>("/auth/user/register");

  const { mutate } = useOptimisticList("/auth/list/users");

  const onSubmit = async (payload: InviteUserPayload) => {
    try {
      await trigger({ ...payload, organizationName: "User" });

      toast.success("Pengguna telah diundang untuk bergabung.");
      reset();

      await mutate({
        name: payload.username,
        email: payload.email,
      });
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-4 grid gap-3 sm:gap-2 sm:flex">
        <TextInput
          {...register("username")}
          id="username"
          placeholder="Username"
          className="w-full sm:w-fit rounded-tremor-small"
          required
        />
        <div className="w-full sm:max-w-xs">
          <Controller
            render={({ field }) => (
              <Select {...field} placeholder="Pilih tipe pengguna" className="w-full rounded-tremor-small" required>
                {["Penjual/Pembeli", "Bank", "Notaris"].map((type) => {
                  return (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  );
                })}
              </Select>
            )}
            name="role"
            control={control}
          />
        </div>
        <TextInput
          {...register("email")}
          type="email"
          id="email"
          placeholder="Masukkan email..."
          className="w-full rounded-tremor-small sm:max-w-xs"
          required
        />
        <Button loading={isMutating} type="submit" className="rounded-tremor-small">
          Undang
        </Button>
      </div>
    </form>
  );
}
