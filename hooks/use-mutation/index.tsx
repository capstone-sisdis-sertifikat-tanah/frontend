import { AxiosResponse } from "axios";
import React from "react";
import useSWRMutation from "swr/mutation";

import { api } from "@/lib";

import { MutationState, swrObserver } from "./state";

export function useMutation<T, K = any>(
  key: string,
  mutatorFn: (url: string, payload: T) => Promise<AxiosResponse<K>> = async (url, payload) => {
    switch (options?.method) {
      case "GET":
        return await api.get(url);
      case "POST":
        return await api.post(url, payload);
      case "PUT":
        return await api.put(url, payload);
      case "DELETE":
        return await api.delete(url);
      case "PATCH":
        return await api.patch(url, payload);
      default:
        return await api.post(url, payload);
    }
  },
  options?: {
    mutatedBy?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  }
) {
  const [status, setStatus] = React.useState<MutationState>({
    state: "idle",
  });

  const { trigger, data, error, reset } = useSWRMutation(
    key,
    async (
      url: string,
      data: {
        arg: T;
      }
    ) => {
      try {
        swrObserver.setMutationState(key, {
          state: "loading",
          mutatedBy: options?.mutatedBy,
        });
        const response = await mutatorFn(url, data.arg);
        swrObserver.setMutationState(key, {
          state: "success",
          mutatedBy: options?.mutatedBy,
        });
        return response;
      } catch (error) {
        swrObserver.setMutationState(key, {
          state: "error",
          mutatedBy: options?.mutatedBy,
        });
        throw error;
      }
    }
  );

  React.useEffect(() => {
    const unsubscribe = swrObserver.subscribe(key, (mutationState) => {
      setStatus(mutationState);
    });

    return () => {
      unsubscribe();
    };
  }, [key]);

  return {
    trigger,
    status,
    data,
    error,
    isMutating: status.state === "loading",
    reset: () => {
      reset();
      swrObserver.setMutationState(key, {
        state: "idle",
        mutatedBy: options?.mutatedBy,
      });
    },
  };
}
