import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@tremor/react";
import { usePathname } from "next/navigation";
import React from "react";

type TabContextValues = {
  tabIndexes: {
    [key: string]: number;
  };
  updateTabIndex: (index: number, prefix: string) => void;
};

const TabContext = React.createContext({} as TabContextValues);

export const useTabs = () => {
  const context = React.useContext(TabContext);
  if (!context) {
    throw new Error("useTabs must be used within a TabProvider");
  }
  return context;
};

export function TabProvider({ children }: { children: React.ReactNode }) {
  const [tabIndexes, setTabIndexes] = React.useState({});

  const pathname = usePathname();

  return (
    <TabContext.Provider
      value={{
        tabIndexes,
        updateTabIndex: (index: number, prefix: string) => {
          setTabIndexes({ ...tabIndexes, [prefix + pathname]: index });
        },
      }}
    >
      {children}
    </TabContext.Provider>
  );
}

export function Tabs({
  tabList,
  tabPanels,
  className = "mt-6",
  prefix = "",
}: {
  tabList: Array<string>;
  tabPanels: Array<() => React.JSX.Element>;
  className?: string;
  prefix?: string;
}) {
  const { tabIndexes, updateTabIndex } = useTabs();

  const pathname = usePathname();
  const selectedIndex = tabIndexes[prefix + pathname] ?? 0;

  return (
    <TabGroup className={className} index={selectedIndex} onIndexChange={(index) => updateTabIndex(index, prefix)}>
      <TabList>
        {tabList.map((tab, index) => (
          <Tab key={index}>{tab}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {tabPanels.map((PanelComponent, index) => (
          <TabPanel key={index}>{<PanelComponent />}</TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
