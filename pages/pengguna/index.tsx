import { Info } from "@/components/info";
import { InviteUser } from "@/modules/user/invite-user";
import { UserList } from "@/modules/user/user-list";
import { Divider, Text } from "@tremor/react";
import React from "react";

const info = {
  title: "Undang pengguna baru",
  description: "Pengguna dapat berupa bank, notaris, ataupun penjual/pembeli.",
};

export default function PenggunaPage() {
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

PenggunaPage.title = "Manajemen Pengguna | Sistem Penerbitan Sertifikat Tanah";
