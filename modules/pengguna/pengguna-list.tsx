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
  role: "bank" | "notaris" | "user" | "admin-bpn";
};

export function UserList() {
  const { data, isLoading } = useSWR<{ data: Array<User> }>("/auth/list/all-roles");

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
          <div className="flex gap-x-4 w-full">
            <Avatar />
            <div className="flex-1">
              <p className="text-sm font-semibold leading-6 text-gray-900">{person.name}</p>
              <p className="flex text-xs leading-5 text-gray-500">
                <a href={`mailto:${person.email}`} className="truncate hover:underline">
                  {person.email}
                </a>
              </p>

              <div className="mt-2 flex justify-end">
                {person.role === "bank" && (
                  <div className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                    Bank
                  </div>
                )}
                {person.role === "user" && (
                  <div className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-700/10">
                    Penjual/Pembeli
                  </div>
                )}
                {person.role === "notaris" && (
                  <div className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">
                    Notaris
                  </div>
                )}
                {person.role === "admin-bpn" && (
                  <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    Admin BPN
                  </span>
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
