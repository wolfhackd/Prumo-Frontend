export const Philosophy = () => {
  return (
    <section className="bg-[#FFCC00] text-black flex flex-col justify-around py-6 md:px-16 min-h-screen">
      <div className="flex flex-row items-center justify-center md:justify-start   md:items-end py-8 gap-2">
        <h1 className="monoton-regular text-3xl md:text-4xl lg:text-5xl">
          PRUMO
        </h1>{" "}
        <p className="font-bold sora"> / Nossa Filosofia</p>
      </div>

      <div className="flex flex-col items-center md:items-start justify-center gap-4 py-6">
        <h1 className="sora text-4xl font-bold md:text-5xl lg:text-6xl leading-relaxed">
          NÃO VENDEMOS TEMPO.
          <br />
          COLOCAMOS ELE NO SEU PRUMO
        </h1>
        <p className="sora font-bold text-md md:text-xl lg:text-2xl leading-relaxed">
          “Tempo é dinheiro. Seu negócio merece aproveitar melhor os dois.”
        </p>
        <p className="sora font-bold text-sm md:text-md lg:text-lg leading-relaxed">
          Você cuida do seu negócio. A gente cuida dos seus horários.
        </p>
      </div>

      <div className="flex flex-row justify-between border-t border-black py-12">
        <span className="uppercase sora font-bold">
          MENOS burocracia. mais negócio.
        </span>
        <span className="sora font-bold">FILOSOFIA</span>
      </div>
    </section>
  );
};
