import useSWR from "swr";

import { Avatar } from "@/components/avatar";
import { EmptyPlaceholder } from "../template/empty-placeholder";
import { LoadingPlaceholder } from "../template/loading-placeholder";

const placeholderProps = {
  title: "Belum ada pengguna yang terdaftar",
  description: "Undang pengguna baru untuk memulai",
};

type User = {
  name: string;
  email: string;
};

export function UserList() {
  const { data, isLoading } = useSWR<{ data: Array<User> }>("/auth/list/users");

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  if (data?.data.length === 0 || !data) {
    return <EmptyPlaceholder {...placeholderProps} />;
  }

  return (
    <ul role="list" className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.data.map((person) => (
        <li key={person.email} className="flex justify-between gap-x-6 p-5 border shadow-sm rounded-md">
          <div className="flex min-w-0 gap-x-4">
            <Avatar />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">{person.name}</p>
              <p className="flex text-xs leading-5 text-gray-500">
                <a href={`mailto:${person.email}`} className="truncate hover:underline">
                  {person.email}
                </a>
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
