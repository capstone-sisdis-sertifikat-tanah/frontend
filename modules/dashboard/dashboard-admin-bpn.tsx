import React from "react";
import { Card } from "@tremor/react";
import { useUser } from "@/hooks/use-user";
import useSWR from "swr";
import { Text } from "@tremor/react";
import clsx from "clsx";
import { useBanner } from "@/hooks/use-banner";
import { Tabs } from "@/components/tabs";

export default function DashboardAdminBPN() {
  const {
    user: { username },
  } = useUser();

  return (
    <main>
      <h1 className="text-tremor-title font-semibold">Rincian Perusahaan</h1>
      <Text className="mt-0.5">Informasi umum, supply chain, dan emisi karbon perusahaan Anda.</Text>

      <div className="mt-4">
        {/* <Tabs
          tabList={["Rincian", "Supply Chain", "Emisi Karbon"]}
          tabPanels={[
            () => <CompanyDetails details={company?.data} isLoading={isLoading} />,
            () => (
              <>
                {company?.data.supplyChain.length !== 0 && <CreateSupplyChain details={company?.data} />}
                <ListSupplyChain details={company?.data} />
              </>
            ),
            () => <DetailEmisiKarbon details={company?.data} />,
          ]}
        /> */}
      </div>
    </main>
  );
}
