import { Info } from "@/components/info";
import { Label } from "@/components/label";
import { useMutation } from "@/hooks/use-mutation";
import { UserDataWithToken, useUser } from "@/hooks/use-user";
import { Button, TextInput } from "@tremor/react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const info = {
  title: "Email",
  description: "Perbarui alamat email Anda.",
};

type ChangeEmailPayload = {
  email: string;
};

export function ChangeEmailForm() {
  const { user, updateUserData } = useUser();

  const {
    register,
    handleSubmit,
    formState: { isDirty },
    resetField,
  } = useForm<ChangeEmailPayload>({
    values: {
      email: user.email,
    },
  });

  const { trigger, isMutating } = useMutation<ChangeEmailPayload, { data: UserDataWithToken }>("/auth/edit/email");

  const onSubmit = async (payload: ChangeEmailPayload) => {
    if (!isDirty) return;
    try {
      const userData = await trigger(payload);
      updateUserData(userData.data.data);
      toast.success("Email berhasil diubah.");
    } catch (error) {
      resetField("email");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Info {...info} />
      <div className="mt-6">
        <Label htmlFor="email">Perbarui alamat email</Label>
        <TextInput
          {...register("email")}
          type="email"
          id="email"
          placeholder="john@company.com"
          className="mt-2 w-full rounded-tremor-small sm:max-w-lg"
        />
      </div>
      <Button loading={isMutating} type="submit" className="rounded-tremor-small mt-6">
        Perbarui email
      </Button>
    </form>
  );
}
