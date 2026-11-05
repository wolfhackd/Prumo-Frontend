"use client";

import axios from "axios";
import { Dialog } from "@base-ui/react/dialog";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  appointmentService,
  establishmentService,
} from "@/lib/services";
import type { Establishment } from "@/lib/services/establishments/establishment-service";

const weekdays = [
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
  { value: 7, label: "Domingo" },
];

const inputClassName =
  "mt-1.5 w-full rounded-xl border border-[#D8D4CC] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#6155F5] focus:ring-2 focus:ring-[#6155F5]/15";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
    const message = error.response?.data?.message ?? error.response?.data?.error;
    if (message) {
      return message;
    }
  }

  return error instanceof Error
    ? error.message
    : "Não foi possível concluir o agendamento. Tente novamente.";
}

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function NewAppointmentButton({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [establishment, setEstablishment] = useState<Establishment | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let isCurrent = true;
    const establishmentId = localStorage.getItem(
      "prumo:active-establishment-id",
    );

    if (!establishmentId) {
      Promise.resolve().then(() => {
        if (isCurrent) {
          setEstablishment(null);
          setIsLoading(false);
        }
      });

      return () => {
        isCurrent = false;
      };
    }

    establishmentService
      .getById(establishmentId)
      .then((result) => {
        if (isCurrent) {
          setEstablishment(result);
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setLoadError(getErrorMessage(error));
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
  }, [isOpen, retryCount]);

  function handleOpenChange(open: boolean) {
    if (open) {
      setEstablishment(null);
      setIsLoading(true);
      setLoadError("");
      setSubmitError("");
      setSubmitSuccess("");
    }
    setIsOpen(open);
  }

  function retryLoadingEstablishment() {
    setLoadError("");
    setIsLoading(true);
    setRetryCount((count) => count + 1);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!establishment) {
      return;
    }

    setSubmitError("");
    setSubmitSuccess("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const serviceId = String(formData.get("serviceId"));
    const dayOfWeek = Number(formData.get("dayOfWeek"));
    const hour = String(formData.get("hour"));
    const name = String(formData.get("name")).trim();
    const cpf = String(formData.get("cpf")).replace(/\D/g, "");
    const phone = String(formData.get("phone")).trim();
    const email = String(formData.get("email")).trim();
    const service = establishment.services.find(({ id }) => id === serviceId);
    const businessHour = establishment.businessHours?.find(
      ({ dayOfWeek: businessDay }) => businessDay === dayOfWeek,
    );

    try {
      if (!service) {
        throw new Error("Selecione um serviço válido.");
      }

      if (!businessHour) {
        throw new Error("Selecione um dia em que o estabelecimento funciona.");
      }

      const start = timeToMinutes(hour);
      const opening = timeToMinutes(businessHour.openingTime);
      const closing = timeToMinutes(businessHour.closingTime);
      if (
        !Number.isFinite(start) ||
        !Number.isFinite(opening) ||
        !Number.isFinite(closing) ||
        start < opening ||
        start + service.duration > closing
      ) {
        throw new Error(
          "O horário escolhido precisa estar dentro do funcionamento do estabelecimento.",
        );
      }

      await appointmentService.create({
        establishmentId: establishment.id,
        serviceId,
        hour,
        dayOfWeek,
        name,
        cpf,
        phone,
        email,
      });

      form.reset();
      setSubmitSuccess("Agendamento criado com sucesso.");
      onCreated();
    } catch (error: unknown) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  const businessHours = (establishment?.businessHours ?? [])
    .filter(({ dayOfWeek }) =>
      weekdays.some((weekday) => weekday.value === dayOfWeek),
    )
    .toSorted((first, second) => first.dayOfWeek - second.dayOfWeek);

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger
        className="fixed bottom-[calc(76px+env(safe-area-inset-bottom))] right-4 z-30 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#FFCC00] px-4 py-2 text-xs font-semibold text-[#111111] shadow-[0_4px_14px_rgba(0,0,0,0.2)] transition-colors hover:bg-[#F2C000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6155F5] md:bottom-6 md:right-6"
        type="button"
      >
        <Plus aria-hidden="true" className="size-4" />
        Novo Agendamento
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-[#D8D4CC] bg-[#F3F0E9] p-5 text-[#1C1C1C] shadow-2xl outline-none sm:p-7">
          <header className="mb-5 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-bold">
                Novo Agendamento
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-[#6B6B6B]">
                Informe o serviço, horário e dados do cliente.
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Fechar"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6155F5]"
              type="button"
            >
              <X aria-hidden="true" className="size-5" />
            </Dialog.Close>
          </header>

          {isLoading ? (
            <p aria-live="polite" className="py-8 text-center text-sm">
              Carregando dados do estabelecimento...
            </p>
          ) : loadError ? (
            <div aria-live="polite" className="py-4 text-center">
              <p className="text-sm text-red-700">{loadError}</p>
              <button
                className="mt-4 rounded-xl bg-[#FFCC00] px-4 py-2 text-sm font-semibold hover:bg-[#F2C000]"
                onClick={retryLoadingEstablishment}
                type="button"
              >
                Tentar novamente
              </button>
            </div>
          ) : !establishment ? (
            <div className="py-4 text-center">
              <p className="text-sm text-[#6B6B6B]">
                Selecione um estabelecimento antes de criar um agendamento.
              </p>
              <Link
                className="mt-4 inline-flex rounded-xl bg-[#FFCC00] px-4 py-2 text-sm font-semibold hover:bg-[#F2C000]"
                href="/my-establishments"
              >
                Selecionar estabelecimento
              </Link>
            </div>
          ) : establishment.services.length === 0 ? (
            <div className="py-4 text-center">
              <p className="text-sm text-[#6B6B6B]">
                Cadastre um serviço antes de criar um agendamento.
              </p>
              <Link
                className="mt-4 inline-flex rounded-xl bg-[#FFCC00] px-4 py-2 text-sm font-semibold hover:bg-[#F2C000]"
                href="/services"
              >
                Gerenciar serviços
              </Link>
            </div>
          ) : businessHours.length === 0 ? (
            <div className="py-4 text-center">
              <p className="text-sm text-[#6B6B6B]">
                Configure os horários de funcionamento antes de criar um
                agendamento.
              </p>
              <Link
                className="mt-4 inline-flex rounded-xl bg-[#FFCC00] px-4 py-2 text-sm font-semibold hover:bg-[#F2C000]"
                href="/settings"
              >
                Configurar horários
              </Link>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  className="text-sm font-semibold"
                  htmlFor="appointment-service"
                >
                  Serviço
                </label>
                <select
                  className={inputClassName}
                  defaultValue=""
                  id="appointment-service"
                  name="serviceId"
                  required
                >
                  <option disabled value="">
                    Selecione um serviço
                  </option>
                  {establishment.services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} ({service.duration} min)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    className="text-sm font-semibold"
                    htmlFor="appointment-day"
                  >
                    Dia da semana
                  </label>
                  <select
                    className={inputClassName}
                    defaultValue=""
                    id="appointment-day"
                    name="dayOfWeek"
                    required
                  >
                    <option disabled value="">
                      Selecione um dia
                    </option>
                    {businessHours.map(({ dayOfWeek, openingTime, closingTime }) => {
                      const weekday = weekdays.find(
                        ({ value }) => value === dayOfWeek,
                      );
                      return (
                        <option key={dayOfWeek} value={dayOfWeek}>
                          {weekday?.label} ({openingTime}–{closingTime})
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label
                    className="text-sm font-semibold"
                    htmlFor="appointment-hour"
                  >
                    Horário
                  </label>
                  <input
                    className={inputClassName}
                    id="appointment-hour"
                    name="hour"
                    required
                    type="time"
                  />
                </div>
              </div>

              <div>
                <label
                  className="text-sm font-semibold"
                  htmlFor="appointment-client-name"
                >
                  Nome do cliente
                </label>
                <input
                  autoComplete="name"
                  className={inputClassName}
                  id="appointment-client-name"
                  maxLength={120}
                  name="name"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    className="text-sm font-semibold"
                    htmlFor="appointment-client-cpf"
                  >
                    CPF
                  </label>
                  <input
                    autoComplete="off"
                    className={inputClassName}
                    id="appointment-client-cpf"
                    inputMode="numeric"
                    maxLength={14}
                    name="cpf"
                    pattern="[\d.\-/]{11,14}"
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
                <div>
                  <label
                    className="text-sm font-semibold"
                    htmlFor="appointment-client-phone"
                  >
                    Telefone
                  </label>
                  <input
                    autoComplete="tel"
                    className={inputClassName}
                    id="appointment-client-phone"
                    name="phone"
                    required
                    type="tel"
                  />
                </div>
              </div>

              <div>
                <label
                  className="text-sm font-semibold"
                  htmlFor="appointment-client-email"
                >
                  E-mail
                </label>
                <input
                  autoComplete="email"
                  className={inputClassName}
                  id="appointment-client-email"
                  name="email"
                  required
                  type="email"
                />
              </div>

              {submitError && (
                <p aria-live="assertive" className="text-sm text-red-700">
                  {submitError}
                </p>
              )}
              {submitSuccess && (
                <p aria-live="polite" className="text-sm text-green-700">
                  {submitSuccess}
                </p>
              )}

              <footer className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <Dialog.Close
                  className="min-h-11 rounded-xl border border-[#D8D4CC] px-5 text-sm font-semibold transition hover:bg-white/70"
                  disabled={isSubmitting}
                  type="button"
                >
                  Fechar
                </Dialog.Close>
                <button
                  className="min-h-11 rounded-xl bg-[#FFCC00] px-5 text-sm font-semibold transition hover:bg-[#F2C000] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Criando..." : "Criar agendamento"}
                </button>
              </footer>
            </form>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
