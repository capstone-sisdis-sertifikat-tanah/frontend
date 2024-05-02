import { Label } from "@/components/label";
import { useUser } from "@/hooks/use-user";
import { ChangeEmailForm } from "@/modules/account/change-email-form";
import { ChangePasswordForm } from "@/modules/account/change-password-form";
import { Divider, TextInput } from "@tremor/react";
import useSWR from "swr";

export default function AccountSettingsPage() {
  const { user } = useUser();

  return (
    <>
      <h3 className="text-tremor-title font-bold text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Pengaturan akun
      </h3>
      <p className="mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
        Kelola rincian dan informasi umum yang terkait.
      </p>

      <div className="mt-8 space-y-8">
        <div className="mt-8">
          <h4 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">Umum</h4>
          <p className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
            Informasi umum yang terkait dengan akun anda.
          </p>
          <div className="mt-6">
            <Label>Nama organisasi</Label>
            <TextInput
              value={user.organizationName}
              className="mt-2 w-full rounded-tremor-small sm:max-w-lg"
              disabled
            />
          </div>
          <div className="mt-4">
            <Label>Peran</Label>
            <TextInput value={user.userType} className="mt-2 w-full rounded-tremor-small sm:max-w-lg" disabled />
          </div>
        </div>

        <Divider />

        <ChangeEmailForm />
        <Divider />
        <ChangePasswordForm />
      </div>
    </>
  );
}

AccountSettingsPage.title = "Account Settings | Carbon Chain";
