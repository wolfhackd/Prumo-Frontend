import { ChevronRight } from "lucide-react";

const appointments = [
  {
    time: "10:00 - 11:00",
    name: "Ana Souza",
    service: "Corte e Cor",
    details: "Serviço: Ana Souza - Corte e Cor",
    initials: "AS",
    avatarColor: "bg-[#D7B5A4] text-[#563D32]",
  },
  {
    time: "11:00 - 12:00",
    name: "Leovozza",
    service: "Corte e Cor",
    details: "Serviço: Ana Souza - Corte e Cor",
    initials: "L",
    avatarColor: "bg-[#C9A88F] text-[#563D32]",
  },
  {
    time: "12:30 - 13:00",
    name: "Pedro Silva agendou Massagem",
    service: null,
    details: "Serviço: Ana Souza - Corte e Cor",
    initials: "PS",
    avatarColor: "bg-[#8D9A9B] text-[#263538]",
  },
];

export const Appointments = () => {
  return (
    <section
      aria-labelledby="upcoming-appointments-title"
      className="rounded-2xl border border-[#D8D4CC] p-2.5"
    >
      <header className="flex items-center justify-between px-1 pb-3">
        <h2
          id="upcoming-appointments-title"
          className="text-lg font-bold sm:text-xl"
        >
          Próximos Agendamentos
        </h2>
        <ChevronRight aria-hidden="true" className="size-5 shrink-0" />
      </header>

      <ul className="space-y-2">
        {appointments.map((appointment) => (
          <li
            key={appointment.time}
            className="relative grid grid-cols-[minmax(80px,0.8fr)_40px_minmax(0,1.8fr)] items-center gap-x-2 gap-y-2 overflow-hidden rounded-2xl border border-[#D8D4CC] px-3 py-2.5 pl-5 shadow-sm sm:grid-cols-[minmax(120px,0.8fr)_44px_minmax(0,1.8fr)] sm:gap-x-3"
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-2.5 bg-[#FFCC00]"
            />

            <time className="self-start pt-1 text-xs font-bold sm:text-sm">
              {appointment.time}
            </time>

            <div
              aria-hidden="true"
              className={`flex size-10 items-center justify-center rounded-full text-xs font-bold sm:size-11 ${appointment.avatarColor}`}
            >
              {appointment.initials}
            </div>

            <div className="min-w-0 self-start pt-0.5 pr-5">
              <p className="truncate text-xs font-semibold sm:text-sm">
                {appointment.name}
              </p>
              {appointment.service && (
                <p className="truncate text-xs">{appointment.service}</p>
              )}
              <p className="mt-1 truncate text-[11px] text-[#6B6B6B] sm:text-xs">
                {appointment.details}
              </p>
            </div>

            <ChevronRight
              aria-hidden="true"
              className="absolute right-2.5 top-3 size-4"
            />

            <div className="col-span-3 flex justify-end gap-1.5 sm:col-start-2 sm:col-span-2 sm:gap-2">
              <button
                type="button"
                className="min-w-0 flex-1 rounded-xl bg-[#FFCC00] px-2 py-2 text-[11px] font-medium text-[#1C1C1C] transition-colors hover:bg-[#F2C000] sm:flex-none sm:px-5 sm:text-xs"
              >
                Check-in
              </button>
              <button
                type="button"
                className="min-w-0 flex-1 rounded-xl border border-[#D8D4CC] bg-transparent px-2 py-2 text-[11px] font-medium transition-colors hover:bg-white/50 sm:flex-none sm:px-4 sm:text-xs"
              >
                Reagendar
              </button>
              <button
                type="button"
                className="min-w-0 flex-1 rounded-xl border border-[#D8D4CC] bg-transparent px-2 py-2 text-[11px] font-medium transition-colors hover:bg-white/50 sm:flex-none sm:px-5 sm:text-xs"
              >
                Cancelar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
