import {
  BenefitsStrip,
  ClosingSection,
  CustomerSection,
  HeroSection,
  ManagementSection,
  SiteFooter,
  SiteHeader,
  StepsSection,
} from "./home/sections";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <BenefitsStrip />
        <ManagementSection />
        <CustomerSection />
        <StepsSection />
        <ClosingSection />
      </main>
      <SiteFooter />
    </>
  );
}
