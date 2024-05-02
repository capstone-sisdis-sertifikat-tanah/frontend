import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";

import { Inter } from "next/font/google";
import BaseLayout from "@/modules/layout/base-layout";
import { fetcher } from "@/lib";

import { SWRConfig } from "swr";
import { Seo } from "@/components/seo";
import { Toaster } from "sonner";
import { useUser } from "@/hooks/use-user";
import React from "react";
import { BannerProvider } from "@/hooks/use-banner";
import { TabProvider } from "@/components/tabs";

const inter = Inter({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps,
}: AppProps & {
  Component: { title: string };
}) {
  return (
    <ThemeProvider enableSystem={false} attribute="class">
      <Seo title={Component.title} />
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <div>
        <SWRConfig
          value={{
            fetcher,
          }}
        >
          <Toaster richColors position="bottom-right" />
          <BannerProvider>
            <TabProvider>
              <BaseLayout>
                <PageLoader />
                <Component {...pageProps} />
              </BaseLayout>
            </TabProvider>
          </BannerProvider>
        </SWRConfig>
      </div>
    </ThemeProvider>
  );
}

function PageLoader() {
  const { state } = useUser();
  const [showLoader, setShowLoader] = React.useState(true);

  const timeoutRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (state !== "loading") {
      timeoutRef.current = setTimeout(() => {
        setShowLoader(false);
      }, 150);
    }
  }, [state]);

  if (!showLoader) return null;

  return <div className="fixed z-[99] inset-0 w-screen h-dvh bg-white"></div>;
}
