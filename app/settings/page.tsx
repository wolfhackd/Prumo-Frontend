import type { Metadata } from "next";
import { Nav } from "@/app/dashboard/Nav";
import { BusinessHoursSettings } from "./business-hours-settings";

export const metadata: Metadata = {
  title: "Configurações — Prumo",
  description: "Configure os horários de funcionamento do estabelecimento.",
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#F3F0E9] sora text-[#1C1C1C]">
      <Nav activePage="settings" />
      <main className="min-h-[calc(100vh-60px)] px-4 py-5 pb-36 md:ml-[232px] md:px-6 md:py-7 md:pb-24">
        <div className="mx-auto w-full max-w-5xl">
          <BusinessHoursSettings />
        </div>
      </main>
    </div>
  );
}
