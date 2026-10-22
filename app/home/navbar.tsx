export const NavBar = () => {
  return (
    <nav className="border-b border-[#6155F5] flex flex-col md:flex-row items-center justify-between w-full ">
      {/* Esse texto do prumo fica bom em só branco também */}
      {/* <h1 className="monoton-regular text-[40px] lg:text-[40px] text-white">
        PRUMO
      </h1> */}
      <h1 className="monoton-regular text-[40px] lg:text-[40px] text-white">
        <span className="text-white">P</span>
        <span className="text-[#34C759]">R</span>
        <span className="text-[#FFFF00]">U</span>
        <span className="text-[#6155F5]">M</span>
        <span className="text-[#FF0000]">O</span>
      </h1>
      <div className="flex justify-around items-center w-full flex-col gap-2 py-2 md:flex-row lg:flex-row md:w-2/8">
        <a href="/" className="text-[#6155F5] font-bold">
          PARA DONOS
        </a>
        <a href="/" className="text-[#34C759] font-bold">
          PARA CLIENTES
        </a>
      </div>
      <div className="hidden md:flex items-center">
        <span className="text-xs font-bold text-white">
          DE BRASILEIROS
          <br />
          PARA BRASILEIROS
        </span>
        <img
          className="w-18 h-14"
          src="/Bra-flag.png"
          alt="Imagem da bandeira do brazil"
        />
      </div>
    </nav>
  );
};
