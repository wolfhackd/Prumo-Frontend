"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { establishmentService } from "@/app/services";
import type { Establishment } from "@/app/services/establishments/establishment-service";

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

function formatDayOfWeek(dayOfWeek: number) {
  const days: Record<string, string> = {
    "1": "Segunda-feira",
    "2": "Terça-feira",
    "3": "Quarta-feira",
    "4": "Quinta-feira",
    "5": "Sexta-feira",
    "6": "Sábado",
    "7": "Domingo",
  };

  return days[String(dayOfWeek)] ?? `Dia ${dayOfWeek}`;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Não foi possível carregar os estabelecimentos. Tente novamente.";
}

export default function EstablishmentsPage() {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [selectedEstablishmentId, setSelectedEstablishmentId] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    let isCurrent = true;

    establishmentService
      .getForOwner()
      .then((results) => {
        if (isCurrent) {
          setEstablishments(results);
          const storedEstablishmentId = localStorage.getItem(
            "prumo:active-establishment-id",
          );
          const hasStoredEstablishment = results.some(
            ({ id }) => id === storedEstablishmentId,
          );

          setSelectedEstablishmentId(
            hasStoredEstablishment ? (storedEstablishmentId ?? "") : "",
          );
          if (storedEstablishmentId && !hasStoredEstablishment) {
            localStorage.removeItem("prumo:active-establishment-id");
          }
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
  }, [retryCount]);

  function retry() {
    setErrorMessage("");
    setIsLoading(true);
    setRetryCount((count) => count + 1);
  }

  function selectEstablishment(establishmentId: string) {
    localStorage.setItem("prumo:active-establishment-id", establishmentId);
    setSelectedEstablishmentId(establishmentId);
    router.push("/dashboard");
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
            Seus estabelecimentos
          </h1>
          <p className="mt-2 text-sm text-black/60">
            Selecione um dos estabelecimentos vinculados à sua conta para
            continuar.
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
            Nenhum estabelecimento vinculado à sua conta foi encontrado.
          </p>
        ) : (
          <section
            aria-label="Estabelecimentos da sua conta"
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold text-[#171717]">
              Seus estabelecimentos
            </h2>
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
                  <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                    <p className="text-xs text-black/45">
                      Desde {formatDate(establishment.createdAt)}
                    </p>
                    <button
                      aria-pressed={
                        selectedEstablishmentId === establishment.id
                      }
                      className="rounded-full bg-[#FFCC00] px-4 py-2 text-sm font-semibold text-[#171717] transition hover:bg-[#f0bd00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717]"
                      onClick={() => selectEstablishment(establishment.id)}
                      type="button"
                    >
                      {selectedEstablishmentId === establishment.id
                        ? "Estabelecimento atual"
                        : "Usar este estabelecimento"}
                    </button>
                  </div>
                </div>

                <div className="mt-5 border-t border-black/10 pt-4">
                  <h3 className="text-sm font-semibold text-black/80">
                    Horário de funcionamento
                  </h3>
                  {establishment.businessHours.length ? (
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {establishment.businessHours.map((hours, index) => (
                        <li
                          className="flex items-center justify-between gap-3 rounded-xl bg-[#f7f7fb] px-4 py-3 text-sm"
                          key={`${hours.dayOfWeek}-${hours.openingTime}-${index}`}
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
                          {service.description && (
                            <p className="mt-1 text-sm text-black/55">
                              {service.description}
                            </p>
                          )}
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

      </div>
    </main>
  );
}
