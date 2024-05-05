import { Info, Tabs } from "@/components";
import { useUser } from "@/hooks/use-user";
import { AktaTanahList } from "@/modules/akta-tanah/akta-tanah-list";
import { Text } from "@tremor/react";
import React from "react";

export default function AktaTanahPage() {
  const {
    user: { userType },
  } = useUser();
  return (
    <main>
      <h1 className="text-tremor-title font-semibold">Manajemen Akta Tanah</h1>
      {userType === "user" && <Text className="mt-0.5">Kelola akta tanah Anda yang terdaftar di dalam sistem.</Text>}
      {userType !== "user" && <Text className="mt-0.5">Daftar akta tanah yang terdaftar di dalam sistem.</Text>}

      {userType === "user" && (
        <Tabs
          className="mt-2"
          tabList={["Sebagai Pembeli", "Sebagai Penjual"]}
          tabPanels={[() => <AktaTanahList type="pembeli" />, () => <AktaTanahList type="penjual" />]}
        />
      )}

      {userType === "admin-bpn" && <AktaTanahList type="all" />}
    </main>
  );
}

AktaTanahPage.title = "Manajemen Akta Tanah | Sistem Penerbitan Sertifikat Tanah";
