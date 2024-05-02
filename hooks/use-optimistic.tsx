import useSWR from "swr";
import { useSWRConfig } from "swr";

// Used when adding a new item to a list
export function useOptimisticList(key: string) {
  const { data, mutate: swrMutate } = useSWR(key);
  const { mutate: globalMutate } = useSWRConfig();

  return {
    mutate: async (newData: any) => {
      const optimisticData = {
        data: [...data.data, newData],
      };

      await swrMutate(optimisticData, false);

      setTimeout(() => {
        globalMutate(key);
      }, 3000);
    },
  };
}

// Used when updating an item in a list
export function useOptimisticListUpdate(key: string) {
  const { data, mutate: swrMutate } = useSWR(key);
  const { mutate: globalMutate } = useSWRConfig();

  return {
    mutate: async (newData: any, mapFn: (item: any) => boolean) => {
      const updatedData = data?.data.map((item: any) => {
        const shouldUpdate = mapFn(item);
        if (shouldUpdate) {
          return {
            ...item,
            ...newData,
          };
        }

        return item;
      });

      const optimisticData = {
        data: updatedData,
      };

      await swrMutate(optimisticData, false);

      setTimeout(() => {
        globalMutate(key);
      }, 3000);
    },
  };
}

// Used when updating an object
export function useOptimistic(key: string) {
  const { data, mutate: swrMutate } = useSWR(key);
  const { mutate: globalMutate } = useSWRConfig();

  return {
    mutate: async (newData: any) => {
      const optimisticData = {
        data: {
          ...data.data,
          ...newData,
        },
      };

      await swrMutate(optimisticData, false);

      setTimeout(() => {
        globalMutate(key);
      }, 3000);
    },
  };
}
