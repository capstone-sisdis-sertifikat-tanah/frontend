import { Info } from "@/components/info";
import { Label } from "@/components/label";
import { useMutation } from "@/hooks/use-mutation";
import { Button, TextInput } from "@tremor/react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const info = {
  title: "Kata sandi",
  description: "Perbarui kata sandi Anda.",
};

type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<ChangePasswordPayload>();

  const { trigger, isMutating } = useMutation<ChangePasswordPayload>("/auth/edit/password");

  const onSubmit = async (payload: ChangePasswordPayload) => {
    if (!isDirty) return;
    try {
      await trigger(payload);
      toast.success("Kata sandi berhasil diubah.");
      reset();
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Info {...info} />
      <div className="mt-6">
        <Label htmlFor="current-password">Kata sandi saat ini</Label>
        <TextInput
          {...register("currentPassword")}
          type="password"
          id="current-password"
          placeholder=""
          className="mt-2 w-full rounded-tremor-small sm:max-w-lg"
          required
        />
      </div>
      <div className="mt-4">
        <Label htmlFor="new-password">Kata sandi baru</Label>
        <TextInput
          {...register("newPassword")}
          type="password"
          id="new-password"
          placeholder=""
          className="mt-2 w-full rounded-tremor-small sm:max-w-lg"
          required
        />
      </div>
      <Button loading={isMutating} type="submit" className="rounded-tremor-small mt-6">
        Perbarui kata sandi
      </Button>
    </form>
  );
}
