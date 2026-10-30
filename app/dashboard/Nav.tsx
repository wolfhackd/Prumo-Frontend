import { ChevronDown } from "lucide-react";

export const Nav = () => {
  return (
    <div className="flex flex-row justify-between py-6 border-b">
      <h1 className="text-2xl font-bold sora">
        PRUM<span className="text-[#FFCC00]">O</span>
      </h1>
      <div className="flex flex-row items-center gap-2">
        <div className="size-8 rounded-full bg-[#007AFF]" />
        <ChevronDown />
      </div>
    </div>
  );
};
