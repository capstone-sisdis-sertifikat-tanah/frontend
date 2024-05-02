import React from "react";
import { Divider } from "@tremor/react";
import { Text } from "@tremor/react";
import { UserList } from "../pengguna/pengguna-list";
import { InviteUser } from "../pengguna/invite-pengguna";
import { Info } from "@/components/info";

const info = {
  title: "Undang pengguna baru",
  description: "Pengguna dapat berupa bank, notaris, ataupun penjual/pembeli.",
};

export default function DashboardAdminBPN() {
  return (
    <main>
      <h1 className="text-tremor-title font-semibold">Manajemen Pengguna</h1>
      <Text className="mt-0.5">Daftar Pengguna yang terdaftar di platform Sistem Penerbitan Sertifikat Tanah.</Text>

      <div className="mt-8 space-y-8">
        <div>
          <Info {...info} />
          <InviteUser />
        </div>

        <Divider />

        <div>
          <Info title="Pengguna yang terdaftar" />
          <UserList />
        </div>
      </div>
    </main>
  );
}
