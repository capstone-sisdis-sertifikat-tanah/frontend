import { Button, TextInput } from "@tremor/react";
import { useForm } from "react-hook-form";
import { LoginFormValues, useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const { handleSubmit, register } = useForm<LoginFormValues>();

  const { login, isRequesting } = useUser();

  const router = useRouter();

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center pb-16 pt-12">
      <div className="w-full mx-auto max-w-sm mt-8">
        <form onSubmit={handleSubmit(login)}>
          <div className="mt-6">
            <label
              htmlFor="username"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Username
            </label>
            <TextInput
              {...register("username")}
              id="username"
              placeholder=""
              autoComplete="off"
              className="mt-2 w-full rounded-tremor-small sm:max-w-lg"
              required
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="password"
              className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
            >
              Password
            </label>
            <TextInput
              type="password"
              id="password"
              {...register("password")}
              placeholder=""
              className="mt-2 w-full rounded-tremor-small sm:max-w-lg"
              required
            />
          </div>

          <Button loading={isRequesting} className="mt-6 rounded-tremor-small w-full" type="submit" variant="primary">
            Masuk
          </Button>
        </form>
      </div>
    </div>
  );
}
