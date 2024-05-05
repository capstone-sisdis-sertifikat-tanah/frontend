import { Text } from "@tremor/react";
import React from "react";
import { SertifikatList } from "@/modules/sertifikat";
import { useUser } from "@/hooks/use-user";

export default function SertifikatPage() {
  const {
    user: { userType },
  } = useUser();

  return (
    <main>
      <h1 className="text-tremor-title font-semibold">Manajemen Sertifikat</h1>
      {userType === "user" && <Text className="mt-0.5">Kelola sertifikat tanah yang Anda miliki.</Text>}
      {userType === "admin-bpn" && (
        <Text className="mt-0.5">Kelola sertifikat tanah yang terdaftar di dalam sistem.</Text>
      )}

      {userType === "user" && <SertifikatList type="pemilik" />}
      {userType === "admin-bpn" && <SertifikatList type="all" />}
    </main>
  );
}

SertifikatPage.title = "Manajemen sertifikat | Sistem Penerbitan Sertifikat Tanah";
