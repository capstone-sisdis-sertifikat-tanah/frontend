import { api } from "@/lib";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { mutate as swrMutate } from "swr";
import { useBanner } from "./use-banner";

type UserState = "authenticated" | "unauthenticated" | "loading";

export type UserType = "admin-bpn" | "bank" | "notaris" | "user";

export type UserData = {
  email: string;
  id: string;
  organizationName: string;
  userType: UserType;
  username: string;
};

export type UserDataWithToken = UserData & {
  token: string;
};

export type LoginFormValues = {
  username: string;
  password: string;
};

const id = "auth-toast";

export function useUser(): {
  user: UserData;
  state: UserState;
  login: (payload: LoginFormValues) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (userData: UserDataWithToken) => Promise<void>;
  isRequesting: boolean;
} {
  const {
    data: user,
    isLoading,
    mutate,
  } = useSWR<UserData | null>("/auth/me", async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      return JSON.parse(userData);
    }

    return null;
  });

  const { resetBanner } = useBanner();

  const [isRequesting, setIsRequesting] = React.useState(false);

  const router = useRouter();

  const updateUserData = React.useCallback(
    async (userData: UserDataWithToken) => {
      localStorage.setItem("token", userData.token);

      const { token, ...rest } = userData;

      localStorage.setItem("userData", JSON.stringify(rest));
      await mutate(rest);
    },
    [mutate]
  );

  const login = React.useCallback(
    async (payload: LoginFormValues) => {
      try {
        setIsRequesting(true);
        const userData = await mutate(async () => {
          const response = await api.post<{ data: UserDataWithToken }>("/auth/login", payload);
          const userData = response.data.data;
          localStorage.setItem("token", userData.token);

          const { token, ...rest } = userData;

          localStorage.setItem("userData", JSON.stringify(rest));
          return rest;
        });

        if (userData) {
          router.replace("/dashboard");
          toast.success(`Selamat datang, ${userData.username}!`, {
            id,
          });
        }
      } catch (err) {
      } finally {
        setIsRequesting(false);
      }
    },
    [mutate, router]
  );

  const logout = React.useCallback(async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");

    await swrMutate(() => true, undefined, { revalidate: false });

    router.replace("/login");
    toast.success("Anda telah keluar.", {
      id,
    });

    resetBanner();
  }, [resetBanner, router]);

  let state: UserState = "loading";

  if (!isLoading) {
    if (user) state = "authenticated";
    if (!user) state = "unauthenticated";
  }

  return { user: user as UserData, state, login, logout, updateUserData, isRequesting };
}
