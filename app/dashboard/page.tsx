import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Appointments } from "./Appointments";
import { CustomerStats } from "./CustomerStats";
import { GridStats } from "./GridStats";
import { Nav } from "./Nav";
import { RecentActivity } from "./RecentActivity";

export const metadata: Metadata = {
  title: "Dashboard — Prumo",
  description: "Acompanhe seus indicadores e próximos agendamentos.",
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F3F0E9] sora text-[#1C1C1C]">
      <Nav />
      <main className="min-h-[calc(100vh-60px)] px-4 py-5 pb-36 md:ml-[232px] md:px-6 md:py-7 md:pb-24 min-[1200px]:pr-2">
        <div className="mx-auto grid w-full max-w-[1400px] gap-4 min-[1200px]:grid-cols-[minmax(0,2fr)_minmax(340px,0.98fr)]">
          <div className="min-w-0">
            <GridStats />
            <div className="mt-4">
              <Appointments />
            </div>
          </div>
          <aside className="min-w-0 space-y-4 min-[1200px]:pt-[2px]">
            <RecentActivity />
            <CustomerStats />
          </aside>
        </div>
      </main>
      <button
        type="button"
        className="fixed bottom-[calc(76px+env(safe-area-inset-bottom))] right-4 z-30 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#FFCC00] px-4 py-2 text-xs font-semibold text-[#111111] shadow-[0_4px_14px_rgba(0,0,0,0.2)] transition-colors hover:bg-[#F2C000] md:bottom-6 md:right-6"
      >
        <Plus aria-hidden="true" className="size-4" />
        Novo Agendamento
      </button>
    </div>
  );
}
