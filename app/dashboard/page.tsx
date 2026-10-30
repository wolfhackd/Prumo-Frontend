import type { Metadata } from "next";
import { Appointments } from "./Appointments";
import { GridStats } from "./GridStats";
import { Nav } from "./Nav";

export const metadata: Metadata = {
  title: "Dashboard — Prumo",
  description: "Acompanhe seus indicadores e próximos agendamentos.",
};

export default function Dashboard() {
  return (
    <section className="px-4 bg-[#F3F0E9] min-h-screen sora">
      <Nav />
      <main className="mx-auto w-full max-w-5xl py-8">
        <GridStats />
        <div className="mt-8">
          <Appointments />
        </div>
      </main>
    </section>
  );
}
