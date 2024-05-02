import React from "react";

const BannerContext = React.createContext<{
  isOpen: boolean;
  closeBanner: () => void;
  resetBanner: () => void;
}>({
  isOpen: false,
  closeBanner: () => {},
  resetBanner: () => {},
});

export const useBanner = () => React.useContext(BannerContext);

export function BannerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const banner = localStorage.getItem("banner");

    if (!banner) {
      setIsOpen(true);
    }
  }, []);

  const closeBanner = () => {
    localStorage.setItem("banner", "closed");
    setIsOpen(false);
  };

  const resetBanner = () => {
    localStorage.removeItem("banner");
    setIsOpen(true);
  };

  return (
    <BannerContext.Provider
      value={{
        isOpen,
        closeBanner,
        resetBanner,
      }}
    >
      {children}
    </BannerContext.Provider>
  );
}
