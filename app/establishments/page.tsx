"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { establishmentService } from "@/app/services";
import type { Establishment } from "@/app/services/establishments/establishment-service";

const PAGE_SIZE = 10;

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("pt-BR").format(date);
}

function formatDayOfWeek(dayOfWeek: string) {
  const days: Record<string, string> = {
    MONDAY: "Segunda-feira",
    TUESDAY: "Terça-feira",
    WEDNESDAY: "Quarta-feira",
    THURSDAY: "Quinta-feira",
    FRIDAY: "Sexta-feira",
    SATURDAY: "Sábado",
    SUNDAY: "Domingo",
  };
  const normalizedDay = dayOfWeek.trim().toUpperCase();

  return days[normalizedDay] ?? dayOfWeek;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Não foi possível carregar os estabelecimentos. Tente novamente.";
}

export default function EstablishmentsPage() {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [page, setPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    establishmentService
      .getAll(page, PAGE_SIZE)
      .then((results) => {
        if (isCurrent) {
          setEstablishments(results);
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setErrorMessage(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [page, retryCount]);

  function changePage(nextPage: number) {
    setErrorMessage("");
    setIsLoading(true);
    setPage(nextPage);
  }

  function retry() {
    setErrorMessage("");
    setIsLoading(true);
    setRetryCount((count) => count + 1);
  }

  return (
    <main className="min-h-screen bg-[#f7f7fb] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <Link
            className="text-sm font-semibold text-[#6155F5] hover:underline"
            href="/"
          >
            ← Voltar para o início
          </Link>
          <h1 className="mt-5 text-3xl font-bold text-[#171717] sm:text-4xl">
            Estabelecimentos
          </h1>
          <p className="mt-2 text-sm text-black/60">
            Consulte estabelecimentos e os serviços oferecidos por cada um.
          </p>
        </header>

        {isLoading ? (
          <p
            aria-live="polite"
            className="rounded-2xl border border-black/10 bg-white p-8 text-center text-sm text-black/60"
          >
            Carregando estabelecimentos...
          </p>
        ) : errorMessage ? (
          <div
            aria-live="polite"
            className="rounded-2xl border border-red-200 bg-white p-8 text-center"
          >
            <p className="text-sm text-red-700">{errorMessage}</p>
            <button
              className="mt-4 rounded-full bg-[#6155F5] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#5145e5]"
              onClick={retry}
              type="button"
            >
              Tentar novamente
            </button>
          </div>
        ) : establishments.length === 0 ? (
          <p className="rounded-2xl border border-black/10 bg-white p-8 text-center text-sm text-black/60">
            Nenhum estabelecimento encontrado nesta página.
          </p>
        ) : (
          <section aria-label="Lista de estabelecimentos" className="space-y-4">
            {establishments.map((establishment) => (
              <article
                className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6"
                key={establishment.id}
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <h2 className="text-xl font-bold text-[#171717]">
                      {establishment.name}
                    </h2>
                    <p className="mt-2 text-sm text-black/65">
                      <a
                        className="hover:text-[#6155F5] hover:underline"
                        href={`mailto:${establishment.email}`}
                      >
                        {establishment.email}
                      </a>
                      <span className="mx-2" aria-hidden="true">
                        ·
                      </span>
                      <a
                        className="hover:text-[#6155F5] hover:underline"
                        href={`tel:${establishment.phone}`}
                      >
                        {establishment.phone}
                      </a>
                    </p>
                    {(establishment.website || establishment.location) && (
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-black/55">
                        {establishment.website && (
                          <a
                            className="text-[#6155F5] hover:underline"
                            href={establishment.website}
                            rel="noreferrer"
                            target="_blank"
                          >
                            Site
                          </a>
                        )}
                        {establishment.location && (
                          <span>{establishment.location}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="shrink-0 text-xs text-black/45">
                    Desde {formatDate(establishment.createdAt)}
                  </p>
                </div>

                <div className="mt-5 border-t border-black/10 pt-4">
                  <h3 className="text-sm font-semibold text-black/80">
                    Horário de funcionamento
                  </h3>
                  {establishment.openingHours?.length ? (
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {establishment.openingHours.map((hours, index) => (
                        <li
                          className="flex items-center justify-between gap-3 rounded-xl bg-[#f7f7fb] px-4 py-3 text-sm"
                          key={`${hours.establishmentId}-${hours.dayOfWeek}-${index}`}
                        >
                          <span className="font-medium text-black/75">
                            {formatDayOfWeek(hours.dayOfWeek)}
                          </span>
                          <span className="text-black/60">
                            {hours.openingTime}–{hours.closingTime}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-black/50">
                      Horário não informado.
                    </p>
                  )}
                </div>

                <div className="mt-5 border-t border-black/10 pt-4">
                  <h3 className="text-sm font-semibold text-black/80">
                    Serviços ({establishment.services.length})
                  </h3>
                  {establishment.services.length === 0 ? (
                    <p className="mt-2 text-sm text-black/50">
                      Nenhum serviço cadastrado.
                    </p>
                  ) : (
                    <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                      {establishment.services.map((service) => (
                        <li
                          className="rounded-xl bg-[#f7f7fb] p-4"
                          key={service.id}
                        >
                          <p className="font-semibold text-black/85">
                            {service.name}
                          </p>
                          <p className="mt-1 text-sm text-black/55">
                            {service.description}
                          </p>
                          <p className="mt-3 text-sm font-medium text-[#5145e5]">
                            {formatPrice(service.price)} · {service.duration}{" "}
                            min
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}

        <nav
          aria-label="Paginação dos estabelecimentos"
          className="mt-8 flex items-center justify-between"
        >
          <button
            className="rounded-full border border-black/15 bg-white px-5 py-2 text-sm font-semibold text-black/70 transition hover:border-[#6155F5] hover:text-[#6155F5] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={page === 1 || isLoading}
            onClick={() => changePage(page - 1)}
            type="button"
          >
            Anterior
          </button>
          <span aria-live="polite" className="text-sm text-black/55">
            Página {page}
          </span>
          <button
            className="rounded-full border border-black/15 bg-white px-5 py-2 text-sm font-semibold text-black/70 transition hover:border-[#6155F5] hover:text-[#6155F5] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isLoading || establishments.length < PAGE_SIZE}
            onClick={() => changePage(page + 1)}
            type="button"
          >
            Próxima
          </button>
        </nav>
      </div>
    </main>
  );
}
