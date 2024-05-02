import { useUser } from "@/hooks/use-user";

import React, { Suspense } from "react";

const DashboardBank = React.lazy(() => import("@/modules/dashboard/dashboard-bank"));
const DashboardAdminBPN = React.lazy(() => import("@/modules/dashboard/dashboard-admin-bpn"));
const DashboardUser = React.lazy(() => import("@/modules/dashboard/dashboard-user"));
const DashboardNotaris = React.lazy(() => import("@/modules/dashboard/dashboard-notaris"));

export default function HomePage() {
  const {
    user: { userType },
  } = useUser();

  return (
    <>
      <Suspense fallback={null}>
        {userType === "bank" && <DashboardBank />}
        {userType === "notaris" && <DashboardNotaris />}
        {userType === "admin-bpn" && <DashboardAdminBPN />}
        {userType === "user" && <DashboardUser />}
      </Suspense>
    </>
  );
}

HomePage.title = "Dashboard | Sistem Penerbitan Sertifikat Tanah";
