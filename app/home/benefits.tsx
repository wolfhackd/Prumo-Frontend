export const Benefits = () => {
  const cards = [
    {
      title: "Mais Organização",
      description:
        "Reúna seus agendamentos em um só lugar e tenha uma visão mais clara dos compromissos do dia. Assim, fica mais fácil acompanhar os atendimentos e manter a rotina do estabelecimento organizada",
      mark: "01 / ORGANIZAÇÃO",
    },
    {
      title: "Menos tempo com a organização.",
      description:
        "Simplifique o acompanhamento da agenda e reduza a necessidade de recorrer a anotações dispersas ou controles separados. Tenha as informações mais importantes acessíveis para cuidar melhor do dia a dia.",
      mark: "02 / PRATICIDADE",
    },
    {
      title: "Mais clareza para gerenciar.",
      description:
        "Organize os serviços oferecidos e acompanhe os horários agendados com mais facilidade. Com as informações centralizadas, você ganha uma visão melhor da operação e pode planejar a rotina com mais segurança.",
      mark: "03 / CONTROLE",
    },
  ];
  return (
    <section className="flex flex-col justify-around py-6 md:px-16 bg-[#F3F0E9] relative z-20 sora">
      <p className="font-bold sora py-4">04 / BENEFÍCIOS</p>

      <div className="border-b ">
        <h1 className="sora font-bold text-5xl">
          Mais Organização. <span className="text-[#FFCC00]">Mais Prumo.</span>
        </h1>
        <p className="font-light sora py-4">
          Ferramentas para deixar a rotina do seu negócio mais simples.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 py-4">
        {cards.map((card, index) => (
          <div
            key={card.mark}
            className={(index === 1 ? "border-x border-black px-4" : "") + ""}
          >
            <h3 className="text-[#FFCC00] font-bold sora py-4">{card.mark}</h3>

            <h2
              className="
          sora font-bold py-4"
            >
              {card.title}
            </h2>

            <p className="font-light sora py-4">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
