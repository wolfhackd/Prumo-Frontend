import { MoreHorizontal } from "lucide-react";

const monthlyStats = [
  { month: "Jun", newCustomers: 32, returning: 17 },
  { month: "Jul", newCustomers: 27, returning: 19 },
  { month: "Ago", newCustomers: 39, returning: 17 },
  { month: "Set", newCustomers: 35, returning: 22 },
  { month: "Out", newCustomers: 29, returning: 23 },
  { month: "Nov", newCustomers: 44, returning: 24 },
];

export function CustomerStats() {
  return (
    <section
      aria-labelledby="customer-stats-title"
      className="rounded-lg border border-[#D8D4CC] bg-[#F7F4F0] p-4 shadow-[0_1px_3px_rgba(28,28,28,0.04)]"
    >
      <header className="flex items-start justify-between">
        <div>
          <h2
            id="customer-stats-title"
            className="text-base font-bold leading-tight"
          >
            Novos Clientes vs. Retorno
          </h2>
          <p className="mt-1 text-xs text-[#6B6B6B]">no mês</p>
        </div>
        <button
          type="button"
          aria-label="Mais opções das estatísticas de clientes"
          className="-mr-2 -mt-2 flex size-8 items-center justify-center rounded-full text-[#1C1C1C] transition-colors hover:bg-black/5"
        >
          <MoreHorizontal aria-hidden="true" className="size-5" />
        </button>
      </header>

      <div className="mt-4 flex gap-2">
        <div
          aria-hidden="true"
          className="flex h-36 flex-col justify-between pb-0.5 text-[10px] text-[#666666]"
        >
          {[50, 40, 30, 20, 10, 0].map((value) => (
            <span key={value}>{value}</span>
          ))}
        </div>
        <div
          role="img"
          aria-label="Gráfico mensal: clientes novos e clientes que retornaram, de junho a novembro"
          className="relative grid h-36 flex-1 grid-cols-6 border-b border-l border-[#D8D4CC]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex flex-col justify-between"
          >
            {monthlyStats.map(({ month }) => (
              <span key={month} className="border-t border-[#E5E1DA]" />
            ))}
          </div>
          {monthlyStats.map(({ month, newCustomers, returning }) => (
            <div
              key={month}
              className="relative z-10 flex h-full items-end justify-center gap-1 px-0.5"
            >
              <span
                aria-hidden="true"
                className="w-[36%] rounded-t-[2px] bg-[#FFCC00]"
                style={{ height: `${(newCustomers / 50) * 100}%` }}
              />
              <span
                aria-hidden="true"
                className="w-[36%] rounded-t-[2px] bg-[#191919]"
                style={{ height: `${(returning / 50) * 100}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="ml-7 mt-1 grid grid-cols-6 text-center text-[10px] text-[#666666]"
      >
        {monthlyStats.map(({ month }) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </section>
  );
}
