import {
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  UserRound,
} from "lucide-react";

const stats = [
  {
    label: "Agendamentos hoje",
    value: "15",
    icon: CalendarDays,
  },
  {
    label: "Próximo cliente",
    value: "Ana Souza em 15 min",
    icon: UserRound,
  },
  {
    label: "Total da semana",
    value: "58",
    icon: ChartNoAxesColumnIncreasing,
  },
];

export const GridStats = () => {
  return (
    <section aria-labelledby="dashboard-summary-title">
      <h1
        id="dashboard-summary-title"
        className="mb-4 text-2xl font-bold md:mb-5"
      >
        Resumo
      </h1>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,0.9fr)] md:gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <article
            key={label}
            className="relative flex min-h-[82px] items-center rounded-lg border border-[#D8D4CC] px-4 py-3 shadow-[0_1px_3px_rgba(28,28,28,0.04)]"
          >
            <div className="min-w-0 pr-8">
              <p className="mb-2 whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.1em] text-[#545454]">
                {label}
              </p>
              <p
                className={`truncate font-bold leading-none ${
                  label === "Próximo cliente" ? "text-sm" : "text-2xl"
                }`}
              >
                {value}
              </p>
            </div>
            <Icon
              aria-hidden="true"
              className="absolute bottom-4 right-4 size-5 text-[#E6B900]"
              strokeWidth={2.2}
            />
          </article>
        ))}
      </div>
    </section>
  );
};
