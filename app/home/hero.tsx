import { HeroButton } from "@/components/HeroButton";

export const Hero = () => {
  const letters = [
    {
      letter: "P",
      color: "#ffffff",
    },
    {
      letter: "R",
      color: "#34C759",
    },
    {
      letter: "U",
      color: "#FFCC00",
    },
    {
      letter: "M",
      color: "#6155F5",
    },
    {
      letter: "O",
      color: "#FF0000",
    },
  ];

  return (
    <section>
      <div className="flex flex-col justify-center lg:flex-row lg:relative">
        <h1 className="sora font-bold text-3xl md:text-5xl/snug text-white py-28 z-10 text-center lg:text-left lg:w-full">
          FEITO PARA O <span className="text-[#FF0000]">EMPREENDEDOR</span>
          <br /> QUE <span className="text-[#34C759]">APROVEITA</span> CADA{" "}
          <br />
          <span className="text-[#6155F5]">SEGUNDO</span> DO <br /> SEU{" "}
          <span className="text-[#FFFF00]">NEGÓCIO.</span>
        </h1>

        <div className="flex items-center justify-center lg:absolute lg:-translate-y-1/2 lg:right-1 lg:top-1/2 select-none p-4">
          {letters.map((letter) => {
            return (
              <div
                style={{ backgroundColor: letter.color }}
                className="size-32 flex items-center justify-center monoton-regular z-8"
                key={`id${letter.letter}1`}
              >
                <span className="text-4xl md:text-6xl lg:text-8xl">
                  {letter.letter}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center lg:items-start lg:justify-center gap-4">
        <p className="text-[#FFCC00]">Cansado de perder clientes?</p>

        <HeroButton />
      </div>
    </section>
  );
};
