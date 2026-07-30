import { HomeFooter } from "@/src/components/landing/home-footer";
import { HomeNavbar } from "@/src/components/landing/home-navbar";

export function LandingPageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-hidden landing-root">
      <HomeNavbar />
      {children}
      <HomeFooter />
    </div>
  );
}
