"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  Store,
  UsersRound,
  Wrench,
} from "lucide-react";

const menuItems = [
  { label: "Resumo", icon: Home, active: true },
  { label: "Calendário", icon: CalendarDays },
  { label: "Clientes", icon: UsersRound },
  { label: "Serviços", icon: Wrench },
  { label: "Mensagens", icon: MessageSquare },
  { label: "Configurações", icon: Settings },
];

const mobileMenuItems = [
  { label: "Início", icon: Home, active: true },
  { label: "Agenda", icon: CalendarDays },
  { label: "Clientes", icon: UsersRound },
  { label: "Configurações", icon: Settings },
];

const dashboardDate = "Terça-feira, 26 de Outubro";

function MenuItems() {
  return menuItems.map(({ label, icon: Icon, active }) => (
    <li key={label}>
      {active ? (
        <a
          href="/dashboard"
          aria-current="page"
          className="flex items-center gap-3 rounded-lg bg-[#FFCC00] px-4 py-3 font-semibold text-[#111111]"
        >
          <Icon aria-hidden="true" className="size-5 shrink-0" />
          <span>{label}</span>
        </a>
      ) : (
        <span
          aria-disabled="true"
          title="Disponível em breve"
          className="flex cursor-default items-center gap-3 rounded-lg px-4 py-3 text-white/85 transition-colors hover:bg-white/10"
        >
          <Icon aria-hidden="true" className="size-5 shrink-0" />
          <span>{label}</span>
        </span>
      )}
    </li>
  ));
}

export const Nav = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const router = useRouter();

  async function handleLogout() {
    setIsLoggingOut(true);
    setLogoutError("");

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        throw new Error("Não foi possível encerrar sua sessão. Tente novamente.");
      }

      localStorage.removeItem("prumo:active-establishment-id");
      router.replace("/login");
      router.refresh();
    } catch (error: unknown) {
      setLogoutError(
        error instanceof Error
          ? error.message
          : "Não foi possível encerrar sua sessão. Tente novamente.",
      );
      setIsLoggingOut(false);
    }
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[232px] flex-col bg-[#101010] text-white md:flex">
        <div className="flex h-[60px] items-center border-b border-[#D8D4CC] bg-[#F3F0E9] px-7 text-[#111111]">
          <a href="/dashboard" aria-label="Prumo, início" className="text-3xl font-extrabold tracking-tight">
            PRUM<span className="text-[#FFCC00]">O</span>
          </a>
        </div>

        <nav aria-label="Menu principal" className="flex flex-1 flex-col px-5 py-6">
          <ul className="space-y-2">
            <MenuItems />
          </ul>

          <div className="mt-auto flex items-center justify-between border-t border-white/15 px-1 pt-6">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="size-3 rounded-full bg-[#FFCC00]" />
              <p className="text-[9px] font-medium uppercase leading-tight tracking-[0.12em] text-white/75">
                De brasileiros
                <br />
                para brasileiros
              </p>
            </div>
            <Image
              src="/Bra-flag.png"
              alt="Bandeira do Brasil"
              width={24}
              height={16}
              className="h-4 w-6 rounded-sm object-cover"
            />
          </div>
        </nav>
      </aside>

      <header className="sticky top-0 z-20 border-b border-[#D8D4CC] bg-[#F3F0E9]/95 backdrop-blur md:ml-[232px]">
        <div className="flex h-[60px] items-center justify-between px-4 md:px-6">
          <a
            href="/dashboard"
            aria-label="Prumo, início"
            className="text-2xl font-extrabold tracking-tight md:hidden"
          >
            PRUM<span className="text-[#FFCC00]">O</span>
          </a>
          <p className="hidden text-sm md:block">{dashboardDate}</p>
          <p className="text-xs md:hidden">{dashboardDate}</p>
          <div className="flex items-center gap-2">
            <Link
              href="/my-establishments"
              className="hidden min-h-9 items-center gap-2 rounded-full border border-[#D8D4CC] px-3 text-xs font-semibold transition-colors hover:bg-white/70 md:inline-flex"
            >
              <Store aria-hidden="true" className="size-4" />
              Mudar estabelecimento
            </Link>
            <div className="relative">
              <button
                type="button"
                aria-label="Opções do perfil"
                aria-expanded={isProfileMenuOpen}
                aria-controls="profile-menu"
                onClick={() => {
                  setLogoutError("");
                  setIsProfileMenuOpen((isOpen) => !isOpen);
                }}
                className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6155F5]"
              >
                <span
                  aria-hidden="true"
                  className="flex size-8 items-center justify-center rounded-full bg-[#343434] text-xs font-semibold text-white"
                >
                  P
                </span>
                <ChevronDown aria-hidden="true" className="size-4" />
              </button>
              {isProfileMenuOpen && (
                <div
                  className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-black/10 bg-white p-2 shadow-lg"
                  id="profile-menu"
                  aria-label="Opções do perfil"
                >
                  <Link
                    href="/my-establishments"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-[#222] transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-[#6155F5]"
                  >
                    <Store aria-hidden="true" className="size-4" />
                    Meus estabelecimentos
                  </Link>
                  <button
                    type="button"
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                    className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-600 disabled:cursor-wait disabled:opacity-60"
                  >
                    <LogOut aria-hidden="true" className="size-4" />
                    {isLoggingOut ? "Saindo..." : "Sair"}
                  </button>
                  {logoutError && (
                    <p className="px-3 py-2 text-xs text-red-700" role="alert">
                      {logoutError}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-[#D8D4CC] px-4 py-2 md:hidden">
          <Link
            href="/my-establishments"
            className="flex min-h-9 items-center justify-center gap-2 rounded-full border border-[#D8D4CC] text-xs font-semibold transition-colors hover:bg-white/70"
          >
            <Store aria-hidden="true" className="size-4" />
            Mudar estabelecimento
          </Link>
        </div>
      </header>
      <nav
        aria-label="Menu principal"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#101010] pb-[env(safe-area-inset-bottom)] text-white shadow-[0_-8px_24px_rgba(0,0,0,0.12)] md:hidden"
      >
        <ul className="mx-auto grid min-h-16 max-w-lg grid-cols-4">
          {mobileMenuItems.map(({ label, icon: Icon, active }) => (
            <li key={label}>
              {active ? (
                <a
                  href="/dashboard"
                  aria-current="page"
                  className="flex h-full min-h-16 flex-col items-center justify-center gap-1 text-[#FFCC00]"
                >
                  <Icon aria-hidden="true" className="size-5" />
                  <span className="text-[10px] font-medium">{label}</span>
                </a>
              ) : (
                <span
                  aria-disabled="true"
                  title="Disponível em breve"
                  className="flex h-full min-h-16 cursor-default flex-col items-center justify-center gap-1 text-white/55"
                >
                  <Icon aria-hidden="true" className="size-5" />
                  <span className="text-[10px] font-medium">{label}</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
