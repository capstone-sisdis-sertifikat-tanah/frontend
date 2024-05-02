import axios, { AxiosError } from "axios";

import { UninterceptedApiError } from "@/types/api";
import { toast } from "sonner";

import Router from "next/router";

export const fetcher = async (url: string) => {
  if (url.includes("undefined")) return undefined;
  return api.get(url).then((res) => res.data);
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ROUTE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  if (config.headers) {
    config.headers.Authorization = token ?? "";
  }
  return config;
});

api.interceptors.response.use(
  (config) => {
    return config;
  },
  (error: AxiosError<UninterceptedApiError>) => {
    // Network Error
    if (error.code === "ERR_NETWORK") {
      toast.error("Terjadi kesalahan jaringan.");

      // API Error
    } else if (error.response?.data.error) {
      const errorMessage = error.response.data.error;

      if (typeof errorMessage === "string") {
        handleInvalidToken(errorMessage, () =>
          toast.error(errorMessage, {
            id: errorMessage,
          })
        );
      } else {
        toast.error(errorMessage.message, {
          id: errorMessage.message,
        });
      }

      // Interval Server Error
    } else if (error.response?.status === 500) {
      toast.error("Terjadi kesalahan pada server.");

      // API Error with message
    } else if (error.response?.data?.message) {
      const errorMessage = error.response.data?.message;

      handleInvalidToken(errorMessage, () =>
        toast.error(errorMessage, {
          id: errorMessage,
        })
      );

      // Invalid Token
    } else if (error.response?.status === 401) {
      handleInvalidToken("Invalid token");
    }

    return Promise.reject(error);
  }
);

export const loadingPlaceholder = (length: number) => Array.from({ length }, (_) => null);

const handleInvalidToken = (message: string, callback?: () => void) => {
  if (message === "Invalid token") {
    toast.error("Token tidak valid. Silahkan login kembali.");
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    Router.replace("/login");
  } else {
    callback?.();
  }
};

export function getDateTime(date: Date, time: string) {
  const tanggalBerangkat = new Date(date);

  // Extracting the time components
  var timeComponents = time.split(":");
  var hours = parseInt(timeComponents[0]);
  var minutes = parseInt(timeComponents[1]);

  // Setting the time components to the date object
  tanggalBerangkat.setHours(hours);
  tanggalBerangkat.setMinutes(minutes);

  return tanggalBerangkat;
}

export function getCurrentTime() {
  const currentDate = new Date();
  const currentHour = currentDate.getHours().toString().padStart(2, "0");
  const currentMinute = currentDate.getMinutes().toString().padStart(2, "0");
  return `${currentHour}:${currentMinute}`;
}

export function getReadableDateTime(date: string) {
  const isAM = new Date(date).getHours() < 12;

  return (
    new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) +
    ", " +
    new Date(date).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}
