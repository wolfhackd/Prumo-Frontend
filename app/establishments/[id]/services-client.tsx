"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { establishmentService } from "@/app/services";
import type { Establishment } from "@/app/services/establishments/establishment-service";

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Não foi possível carregar este estabelecimento. Tente novamente.";
}

export function EstablishmentServicesClient({ id }: { id: string }) {
  const [establishment, setEstablishment] = useState<Establishment | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    establishmentService
      .getById(id)
      .then((result) => {
        if (isCurrent) {
          setEstablishment(result);
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
  }, [id, retryCount]);

  function retry() {
    setErrorMessage("");
    setIsLoading(true);
    setRetryCount((count) => count + 1);
  }

  return (
    <main className="min-h-screen bg-[#f7f7fb] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          className="text-sm font-semibold text-[#6155F5] hover:underline"
          href="/establishments"
        >
          ← Voltar aos estabelecimentos
        </Link>

        {isLoading ? (
          <p
            aria-live="polite"
            className="mt-8 rounded-2xl border border-black/10 bg-white p-8 text-center text-sm text-black/60"
          >
            Carregando serviços...
          </p>
        ) : errorMessage ? (
          <div
            aria-live="polite"
            className="mt-8 rounded-2xl border border-red-200 bg-white p-8 text-center"
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
        ) : establishment ? (
          <>
            <header className="mt-6 rounded-2xl border border-black/10 bg-white p-6">
              <h1 className="text-3xl font-bold text-[#171717]">
                {establishment.name}
              </h1>
              {establishment.location && (
                <p className="mt-2 text-sm text-black/60">
                  {establishment.location}
                </p>
              )}
              <p className="mt-1 text-sm text-black/60">
                {establishment.phone}
              </p>
              {establishment.website && (
                <a
                  className="mt-2 inline-block text-sm font-medium text-[#6155F5] hover:underline"
                  href={establishment.website}
                  rel="noreferrer"
                  target="_blank"
                >
                  Acessar site
                </a>
              )}
            </header>

            <section aria-labelledby="services-title" className="mt-8">
              <h2
                className="text-2xl font-bold text-[#171717]"
                id="services-title"
              >
                Serviços disponíveis
              </h2>
              {establishment.services.length === 0 ? (
                <p className="mt-4 rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/60">
                  Este estabelecimento ainda não cadastrou serviços.
                </p>
              ) : (
                <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                  {establishment.services.map((service) => (
                    <li
                      className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
                      key={service.id}
                    >
                      <h3 className="text-lg font-semibold text-[#171717]">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="mt-2 text-sm text-black/60">
                          {service.description}
                        </p>
                      )}
                      <p className="mt-4 text-sm font-semibold text-[#5145e5]">
                        {formatPrice(service.price)} · {service.duration} min
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
