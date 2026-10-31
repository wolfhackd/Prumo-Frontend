import { Check, MoreHorizontal, X } from "lucide-react";

const recentActivity = [
  {
    id: 1,
    title: "Pedro Silva agendou Massagem",
    subtitle: "relaxante às 11:30",
    status: "success",
    avatar: "bg-[radial-gradient(circle_at_30%_30%,#f3ddbc_0%,#ad7d5b_35%,#3a2f2d_75%)]",
  },
  {
    id: 2,
    title: "Pedro Silva agendou Massagem",
    subtitle: "relaxante às 12:30",
    status: "success",
    avatar: "bg-[radial-gradient(circle_at_30%_30%,#efd6b8_0%,#9d7158_35%,#332d2d_75%)]",
  },
  {
    id: 3,
    title: "Pedro Silva agendou Canelorelaxante",
    subtitle: "às 10:30",
    status: "success",
    avatar: "bg-[radial-gradient(circle_at_30%_30%,#efc698_0%,#915f42_35%,#2d2422_75%)]",
  },
  {
    id: 4,
    title: "Pedro Silva agendou Canelorelaxante",
    subtitle: "às 08:00",
    status: "error",
    avatar: "bg-[radial-gradient(circle_at_30%_30%,#d3d3d3_0%,#7a716d_35%,#282828_75%)]",
  },
];

export function RecentActivity() {
  return (
    <section
      aria-labelledby="recent-activity-title"
      className="rounded-lg bg-[#111111] px-4 py-3 text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] md:px-5 md:py-4"
    >
      <header className="mb-1 flex items-center justify-between">
        <h2 id="recent-activity-title" className="text-lg font-bold">
          Atividade Recente
        </h2>
        <button
          type="button"
          aria-label="Mais ações da atividade recente"
          className="flex size-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10"
        >
          <MoreHorizontal aria-hidden="true" className="size-5" />
        </button>
      </header>

      <ul className="relative">
        <span
          aria-hidden="true"
          className="absolute bottom-5 left-[11px] top-5 w-px bg-white/25"
        />
        {recentActivity.map((activity, index) => (
          <li key={activity.id} className="relative flex min-h-[54px] gap-3">
            <span
              aria-hidden="true"
              className={`z-10 mt-2 flex size-[23px] shrink-0 items-center justify-center rounded-full ${
                activity.status === "success"
                  ? "bg-[#FFCC00] text-[#111111]"
                  : "bg-[#E7E7E7] text-[#111111]"
              }`}
            >
              {activity.status === "success" ? (
                <Check className="size-3.5" strokeWidth={3} />
              ) : (
                <X className="size-3.5" strokeWidth={3} />
              )}
            </span>

            <span
              aria-hidden="true"
              className={`mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-[10px] font-bold text-white ${activity.avatar}`}
            >
              PS
            </span>

            <div
              className={`min-w-0 flex-1 py-1 ${
                index !== recentActivity.length - 1
                  ? "border-b border-white/15"
                  : ""
              }`}
            >
              <p className="text-xs leading-4 text-white">
                {activity.title}
              </p>
              <p className="text-xs leading-4 text-white/75">
                {activity.subtitle}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
