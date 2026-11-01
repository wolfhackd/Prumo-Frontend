import type { Metadata } from "next";
import { Nav } from "@/app/dashboard/Nav";
import { ServicesManagementClient } from "./services-management-client";

export const metadata: Metadata = {
  title: "Serviços — Prumo",
  description: "Gerencie os serviços do estabelecimento selecionado.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#F3F0E9] text-[#1C1C1C]">
      <Nav activePage="services" />
      <main className="min-h-[calc(100vh-60px)] px-4 py-5 pb-24 md:ml-[232px] md:px-6 md:py-7">
        <div className="mx-auto w-full max-w-5xl">
          <ServicesManagementClient />
        </div>
      </main>
    </div>
  );
}
