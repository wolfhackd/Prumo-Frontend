import {
  ArrowUpRight,
  ChartColumnIncreasing,
  ChevronDown,
  LucideCalendar1,
  User,
} from "lucide-react";

export const GridStats = () => {
  return (
    <>
      <div>
        <p className="uppercase text-[#6B6B6B] sora">
          terça-feira,26 de outubro
        </p>
        <h1 className=" font-bold text-2xl">Resumo</h1>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="relative border-[#D8D4CC] border rounded-3xl w-full px-4 h-20 flex flex-row items-center py-2">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-[#6B6B6B] text-xs">Agendamentos Hoje</span>
            <h3 className="font-bold text-3xl leading-none">55</h3>
          </div>
          <LucideCalendar1 className="absolute bottom-2 right-4 shrink-0 text-[#FFCC00]" />
        </div>
        <div className="relative border-[#D8D4CC] border rounded-3xl w-full px-4 h-20 flex flex-row items-center py-2">
          <div className="flex min-w-0 flex-col gap-1 self-start">
            <span className="text-[#6B6B6B] text-xs">Próximo Cliente</span>
            <h3 className="truncate font-bold text-xs leading-none">
              Ana Souza em 15 min
            </h3>
          </div>
          <User className="absolute bottom-2 right-4 shrink-0 text-[#FFCC00]" />
        </div>
        <div className="relative border-[#D8D4CC] border rounded-3xl w-full px-4 h-20 flex flex-row items-center py-2">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-[#6B6B6B] text-xs">Total da semana</span>
            <h3 className="font-bold text-3xl leading-none">55</h3>
          </div>
          <ChartColumnIncreasing className="absolute bottom-2 right-4 shrink-0 text-[#FFCC00]" />
        </div>
        <div className="relative border-[#D8D4CC] border rounded-3xl w-full px-4 h-20 flex flex-row items-center py-2">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-[#6B6B6B] text-xs">
              Taxa de Comparecimento
            </span>
            <h3 className="font-bold text-3xl leading-none">55%</h3>
          </div>
          <ArrowUpRight className="absolute bottom-2 right-4 shrink-0 text-[#FFCC00]" />
        </div>
      </div>
    </>
  );
};
