"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { establishmentService, ownerService } from "@/lib/services";
import type { EstablishmentCreateData } from "@/lib/services/establishments/establishment-service";

const inputClassName =
  "mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#6155F5] focus:ring-2 focus:ring-[#6155F5]/15";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
    const message = error.response?.data?.message ?? error.response?.data?.error;
    if (message) {
      return message;
    }
  }

  return error instanceof Error
    ? error.message
    : "Não foi possível criar o estabelecimento. Tente novamente.";
}

export function CreateEstablishmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const session = await ownerService.getSession();
      const data: EstablishmentCreateData = {
        name: String(formData.get("name")).trim(),
        email: String(formData.get("email")).trim(),
        phone: String(formData.get("phone")).trim(),
        website: String(formData.get("website")).trim() || null,
        location: String(formData.get("location")).trim() || null,
        ownerId: session.user.id,
      };

      await establishmentService.create(data);
      router.replace("/my-establishments");
      router.refresh();
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7fb] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          className="text-sm font-semibold text-[#6155F5] hover:underline"
          href="/my-establishments"
        >
          ← Voltar para meus estabelecimentos
        </Link>
        <header className="mb-8 mt-5">
          <h1 className="text-3xl font-bold text-[#171717] sm:text-4xl">
            Criar estabelecimento
          </h1>
          <p className="mt-2 text-sm text-black/60">
            Informe os dados do seu negócio. Você poderá adicionar serviços e
            horários depois.
          </p>
        </header>

        <form
          aria-busy={isSubmitting}
          className="space-y-5 rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-8"
          onSubmit={handleSubmit}
        >
          <fieldset className="space-y-5" disabled={isSubmitting}>
            <div>
              <label className="text-sm font-semibold" htmlFor="name">
                Nome do estabelecimento
              </label>
              <input
                autoComplete="organization"
                className={inputClassName}
                id="name"
                maxLength={120}
                name="name"
                placeholder="Ex.: Barbearia do Centro"
                required
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold" htmlFor="email">
                  E-mail
                </label>
                <input
                  autoComplete="email"
                  className={inputClassName}
                  id="email"
                  maxLength={254}
                  name="email"
                  placeholder="contato@exemplo.com"
                  required
                  type="email"
                />
              </div>
              <div>
                <label className="text-sm font-semibold" htmlFor="phone">
                  Telefone
                </label>
                <input
                  autoComplete="tel"
                  className={inputClassName}
                  id="phone"
                  maxLength={30}
                  name="phone"
                  placeholder="(11) 99999-9999"
                  required
                  type="tel"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold" htmlFor="website">
                Site <span className="font-normal text-black/50">(opcional)</span>
              </label>
              <input
                className={inputClassName}
                id="website"
                maxLength={2048}
                name="website"
                placeholder="https://seusite.com.br"
                type="url"
              />
            </div>

            <div>
              <label className="text-sm font-semibold" htmlFor="location">
                Localização{" "}
                <span className="font-normal text-black/50">(opcional)</span>
              </label>
              <input
                autoComplete="street-address"
                className={inputClassName}
                id="location"
                maxLength={250}
                name="location"
                placeholder="Rua, número, bairro e cidade"
              />
            </div>

            <button
              className="flex min-h-12 w-full items-center justify-center rounded-full bg-[#FFCC00] px-6 text-sm font-bold text-[#171717] transition hover:bg-[#f0bd00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
            >
              {isSubmitting ? "Criando estabelecimento..." : "Criar estabelecimento"}
            </button>
          </fieldset>

          {errorMessage && (
            <p aria-live="polite" className="text-sm text-red-700" role="alert">
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
