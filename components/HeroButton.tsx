"use client";
import { useRouter } from "next/navigation";
import SpecularButton from "@/components/SpecularButton";

export const HeroButton = () => {
  const router = useRouter();

  return (
    <SpecularButton
      size="lg"
      radius={18}
      tint="#FFCC00"
      tintOpacity={0.04}
      textColor="#FFCC00"
      lineColor="#FFCC00"
      baseColor="#FFCC00"
      intensity={1}
      idleIntensity={0.9}
      shineSize={10}
      shineFade={34}
      thickness={1.2}
      glow={1}
      followMouse
      proximity={250}
      style={{}}
      onClick={() => router.push("/registro")}
    >
      Cadastrar meu negócio
    </SpecularButton>
  );
};
