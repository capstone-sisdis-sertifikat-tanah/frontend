import { Text, Divider, Button } from "@tremor/react";
import React from "react";
import { Info, Tabs } from "@/components";
import { DokumenList } from "@/modules/dokumen";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import clsx from "clsx";

const info = {
  title: "Buat Pengajuan Jual Beli Tanah",
  description: "Lakukan pengajuan pembelian/penjualan tanah yang Anda inginkan melalui sistem.",
};

export default function DashboardBank() {
  const router = useRouter();

  const {
    user: { userType },
  } = useUser();

  const isUserOrBPN = userType === "user" || userType === "admin-bpn";
  const isUser = userType === "user";
  return (
    <main>
      <h1 className="text-tremor-title font-semibold">Manajemen Pengajuan Jual Beli</h1>
      <Text className="mt-0.5">Kelola pengajuan jual beli tanah yang terdaftar di dalam sistem.</Text>

      <div className={clsx(isUser ? "mt-8 space-y-8" : "mt-4")}>
        {isUserOrBPN && (
          <>
            <div>
              {isUser && <Info {...info} />}
              <Button onClick={() => router.push("/tanah")} type="button" className="mt-2 rounded-tremor-small">
                Lihat tanah yang terdaftar
              </Button>
            </div>

            <Divider />
          </>
        )}

        <div>
          {isUserOrBPN && (
            <>
              {" "}
              <Info title="Pengajuan pembelian/penjualan yang terdaftar" />
              {isUser ? (
                <Tabs
                  className="mt-2"
                  tabList={["Sebagai Pembeli", "Sebagai Penjual"]}
                  tabPanels={[() => <DokumenList type="pembeli" />, () => <DokumenList type="penjual" />]}
                />
              ) : (
                <DokumenList type="all" />
              )}
            </>
          )}

          {(userType === "bank" || userType === "notaris") && (
            <Tabs
              className="mt-2"
              tabList={["Disetujui", "Menunggu Persetujuan", "Ditolak"]}
              tabPanels={[
                () => <DokumenList type="all" status="Approve" />,
                () => <DokumenList type="all" status="Menunggu Persetujuan" />,
                () => <DokumenList type="all" status="reject" />,
              ]}
            />
          )}
        </div>
      </div>
    </main>
  );
}
