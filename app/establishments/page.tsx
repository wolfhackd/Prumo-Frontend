"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { establishmentService } from "@/app/services";
import type { Establishment } from "@/app/services/establishments/establishment-service";

const PAGE_SIZE = 10;

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
            Encontre um estabelecimento
          </h1>
          <p className="mt-2 text-sm text-black/60">
            Escolha um estabelecimento para consultar os serviços disponíveis.
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
            Ainda não há estabelecimentos cadastrados.
          </p>
        ) : (
          <>
            <section
              aria-label="Estabelecimentos disponíveis"
              className="grid gap-4 sm:grid-cols-2"
            >
              {establishments.map((establishment) => (
                <article
                  className="flex flex-col rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
                  key={establishment.id}
                >
                  <h2 className="text-xl font-bold text-[#171717]">
                    {establishment.name}
                  </h2>
                  {establishment.location && (
                    <p className="mt-2 text-sm text-black/60">
                      {establishment.location}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-black/60">
                    {establishment.phone}
                  </p>
                  <Link
                    className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#FFCC00] px-5 text-sm font-semibold text-[#171717] transition hover:bg-[#f0bd00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                    href={`/establishments/${encodeURIComponent(establishment.id)}`}
                  >
                    Ver serviços
                  </Link>
                </article>
              ))}
            </section>

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
          </>
        )}
      </div>
    </main>
  );
}
