import React from "react";
import Link from "next/link";
import { Tab, TabGroup, TabList } from "@tremor/react";
import { RiMenuLine, RiCloseLine, RiArrowGoBackLine, RiDashboardLine } from "@remixicon/react";
import { Dialog } from "@headlessui/react";
import { usePathname, useRouter } from "next/navigation";
import { ProfileMenu } from "./profile-menu";
import { UserType, useUser } from "@/hooks/use-user";

const navigation: {
  [key in UserType]: Array<{
    name: string | React.ReactNode;
    href: string;
  }>;
} = {
  "admin-bpn": [
    { name: <RiDashboardLine className="w-5 h-5" />, href: "/dashboard" },
    // { name: "Pengguna", href: "/pengguna" },
  ],
  bank: [
    { name: <RiDashboardLine className="w-5 h-5" />, href: "/dashboard" },
    // { name: "Dokumen", href: "/dokumen" },
  ],
  notaris: [
    { name: <RiDashboardLine className="w-5 h-5" />, href: "/dashboard" },
    // { name: "Dokumen", href: "/dokumen" },
  ],
  user: [
    { name: <RiDashboardLine className="w-5 h-5" />, href: "/dashboard" },
    { name: "Akta Tanah", href: "/akta-tanah" },
    // { name: "Sertifikat Tanah", href: "/sertifikat-tanah" },
  ],
};

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const pathname = usePathname();

  const {
    user: { userType },
  } = useUser();

  const selectedTab = navigation[userType].findIndex((item) => pathname === item.href);

  const router = useRouter();

  return (
    <header className="sticky bg-white dark:bg-black inset-x-0 top-0 z-50 flex h-16 border-b border-gray-900/10">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-x-6">
          <button type="button" className="-m-3 p-3 md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <span className="sr-only">Open main menu</span>
            <RiMenuLine className="h-5 w-5 text-gray-900" aria-hidden="true" />
          </button>
        </div>
        {(pathname === "/account" || selectedTab === -1) && (
          <button
            onClick={() => {
              if (window.history?.length > 2) {
                router.back();
              } else {
                router.push("/dashboard");
              }
            }}
            className="flex items-center gap-2 p-3 rounded-tremor-small text-tremor-content hover:bg-tremor-brand-faint hover:text-tremor-brand-subtle max-md:hidden"
          >
            <RiArrowGoBackLine className="w-4 h-4" />
          </button>
        )}
        {selectedTab !== -1 && (
          <nav className="hidden md:flex md:gap-x-11 md:text-sm md:font-semibold md:leading-6 md:text-gray-700">
            <TabGroup index={selectedTab}>
              <TabList variant="solid" className="p-1">
                {navigation[userType].map((item, itemIdx) => (
                  <Link key={itemIdx} href={item.href}>
                    <Tab className="px-4 py-1.5">{item.name}</Tab>
                  </Link>
                ))}
              </TabList>
            </TabGroup>
          </nav>
        )}
        <div className="flex flex-1 items-center justify-end gap-x-6">
          <ProfileMenu />
        </div>
      </div>

      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-4 pb-6 sm:max-w-sm sm:px-6 sm:ring-1 sm:ring-gray-900/10">
          <div className="-ml-0.5 flex h-16 items-center gap-x-6">
            <button type="button" className="-m-2.5 p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">Close menu</span>
              <RiCloseLine className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {navigation[userType].map((item) => (
              <Link
                onClick={() => {
                  setMobileMenuOpen(false);
                }}
                key={item.href}
                href={item.href}
                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
