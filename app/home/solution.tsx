import {
  ArrowDownIcon,
  ArrowUpRightIcon,
  CalendarRangeIcon,
} from "lucide-react";

export const Solution = () => {
  return (
    <section className="flex flex-col justify-around py-6 md:px-16 bg-[#F3F0E9] border-b relative z-20">
      <div className="flex-col md:justify-between md:flex-row flex p-10">
        <p className="font-bold sora">03 / A SOLUÇÃO</p>
        <h1 className="monoton-regular text-[40px] lg:text-[40px] text-white hidden md:block">
          <span className="text-white">P</span>
          <span className="text-[#34C759]">R</span>
          <span className="text-[#FFFF00]">U</span>
          <span className="text-[#6155F5]">M</span>
          <span className="text-[#FF0000]">O</span>
        </h1>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between ">
        <div className="flex flex-col items-start">
          <h1 className="font-bold sora text-5xl">
            SUA OPERAÇÃO. MAIS ORGANIZADA.
          </h1>
          <p className="font-bold sora py-8">
            {" "}
            Estabelecimentos, serviços e agendamentos em um só lugar. Mais
            clareza para organizar a rotina do seu negócio.
          </p>
          <button className="font-bold bg-black text-white p-6 rounded-full flex flex-row items-center gap-4 cursor-pointer my-6 group">
            Veja como funciona{" "}
            <ArrowUpRightIcon className="size-8 group-hover:rotate-45 transition-transform duration-300 ease-out" />
          </button>
          <a className="group relative flex cursor-pointer">
            <ArrowDownIcon className="size-6 font-light" /> Explore os
            benefícios
            <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </a>
        </div>

        <div className="bg-white w-2/6 rounded-4xl flex flex-col justify-between items-center">
          {/* <img src="/solution.png" alt="" /> */}
          <div className="p-5 flex flex-row justify-between w-full border-b">
            <span className="font-bold text-3xl">Agenda</span>
            <CalendarRangeIcon className="size-12" />
          </div>
          <div className="w-2/3 bg-[#D9D9D9] flex flex-row justify-between my-3 rounded-4xl p-4">
            <div className="flex flex-col">
              <span>09:00</span>
              <span className="sora font-bold">Cliente A</span>
            </div>
            <CalendarRangeIcon className="size-12" />
          </div>
          <div className="w-2/3 bg-[#D9D9D9] flex flex-row justify-between my-3 rounded-4xl p-4">
            <div className="flex flex-col">
              <span>14:00</span>
              <span className="sora font-bold">Cliente B</span>
            </div>
            <CalendarRangeIcon className="size-12" />
          </div>
          <div className="w-2/3 bg-[#D9D9D9] flex flex-row justify-between my-3 rounded-4xl p-4">
            <div className="flex flex-col">
              <span>15:30</span>
              <span className="sora font-bold">Cliente C</span>
            </div>
            <CalendarRangeIcon className="size-12" />
          </div>
        </div>
      </div>
    </section>
  );
};
