import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { OwnerRegistrationForm } from "./owner-registration-form";

export default function OwnerRegistrationPage() {
  return (
    <main className="min-h-screen bg-[#F3F0E9] px-4 py-6 text-black sm:px-8 lg:px-16">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between border-b border-black/15 pb-5">
        <Link href="/" aria-label="Voltar para a página inicial">
          <span className="monoton-regular text-3xl" aria-hidden="true">
            <span className="text-black">P</span>
            <span className="text-[#34C759]">R</span>
            <span className="text-[#D6A900]">U</span>
            <span className="text-[#6155F5]">M</span>
            <span className="text-[#FF0000]">O</span>
          </span>
        </Link>
        <Link
          href="/"
          className="sora flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-60"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Voltar para o início
        </Link>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-8 py-10 md:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <section className="flex flex-col justify-between rounded-3xl bg-black p-7 text-white sm:p-10 lg:min-h-[640px] lg:p-12">
          <div>
            <p className="sora text-xs font-bold uppercase tracking-[0.2em] text-[#FFCC00]">
              Para quem empreende
            </p>
            <h1 className="sora mt-8 text-4xl font-bold leading-tight sm:text-5xl">
              Seu negócio
              <br />
              merece mais
              <br />
              <span className="text-[#FFCC00]">Prumo.</span>
            </h1>
            <p className="sora mt-6 max-w-md text-base leading-7 text-white/75">
              Crie sua conta de dono e comece a organizar estabelecimentos,
              serviços e agendamentos em um só lugar.
            </p>
          </div>

          <div className="mt-12 border-t border-white/20 pt-6">
            <p className="sora text-sm font-semibold">
              MENOS burocracia. MAIS negócio.
            </p>
            <div className="mt-5 flex items-center gap-2" aria-hidden="true">
              <span className="size-3 rounded-full bg-[#34C759]" />
              <span className="size-3 rounded-full bg-[#FFCC00]" />
              <span className="size-3 rounded-full bg-[#6155F5]" />
              <span className="size-3 rounded-full bg-[#FF0000]" />
            </div>
          </div>
        </section>

        <section className="flex flex-col justify-center py-2 sm:py-6 lg:px-6">
          <div className="mb-8">
            <p className="sora text-xs font-bold uppercase tracking-[0.18em] text-[#6155F5]">
              Cadastro de dono / 01
            </p>
            <h2 className="sora mt-3 text-3xl font-bold sm:text-4xl">
              Vamos começar?
            </h2>
            <p className="sora mt-3 text-sm leading-6 text-black/65">
              Preencha seus dados para criar sua conta.
            </p>
          </div>

          <OwnerRegistrationForm />

          <p className="sora mt-6 flex items-center gap-2 text-xs text-black/55">
            Seus dados são usados para criar seu acesso ao Prumo.
            <ArrowUpRight size={14} aria-hidden="true" />
            <Link
              href="/login"
              className="font-semibold text-[#6155F5] underline underline-offset-4 hover:opacity-75"
            >
              Já tem conta? Entre aqui
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
