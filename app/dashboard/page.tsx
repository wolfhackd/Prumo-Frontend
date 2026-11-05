import type { Metadata } from "next";
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
    </div>
  );
}
