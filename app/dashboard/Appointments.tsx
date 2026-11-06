"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { appointmentService } from "@/lib/services";
import type { Appointment } from "@/lib/services/establishments/appointment-service";
import { NewAppointmentButton } from "./NewAppointmentButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const avatarColors = [
  "bg-[#D7B5A4] text-[#563D32]",
  "bg-[#C9A88F] text-[#563D32]",
  "bg-[#8D9A9B] text-[#263538]",
];

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

function parseAppointmentDate(dateValue: string) {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?/.exec(
      dateValue,
    );

  if (match) {
    const [, year, month, day, hour, minute, second = "0", fraction = "0"] =
      match;
    const milliseconds = Number(`0.${fraction}`) * 1_000;

    return new Date(
      Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second),
        milliseconds,
      ),
    );
  }

  const parsed = new Date(dateValue);
  return new Date(
    Date.UTC(
      parsed.getFullYear(),
      parsed.getMonth(),
      parsed.getDate(),
      parsed.getHours(),
      parsed.getMinutes(),
      parsed.getSeconds(),
      parsed.getMilliseconds(),
    ),
  );
}

function formatTimeRange(dateValue: string, duration: number) {
  const start = parseAppointmentDate(dateValue);
  const end = new Date(start.getTime() + duration * 60_000);

  return `${formatTime(start)} - ${formatTime(end)}`;
}

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeZone: "UTC",
  }).format(parseAppointmentDate(dateValue));
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getErrorMessage(
  error: unknown,
  fallback = "Não foi possível carregar os agendamentos. Tente novamente.",
) {
  if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
    const message = error.response?.data?.message ?? error.response?.data?.error;
    if (message) {
      return message;
    }
  }

  return error instanceof Error ? error.message : fallback;
}

export const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeEstablishmentMissing, setActiveEstablishmentMissing] =
    useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [cancellingAppointmentId, setCancellingAppointmentId] = useState<
    string | null
  >(null);
  const [appointmentToCancel, setAppointmentToCancel] =
    useState<Appointment | null>(null);
  const [cancelError, setCancelError] = useState("");
  const [cancelSuccess, setCancelSuccess] = useState("");
  const [checkingInAppointmentId, setCheckingInAppointmentId] = useState<
    string | null
  >(null);
  const [checkInError, setCheckInError] = useState("");
  const [checkInSuccess, setCheckInSuccess] = useState("");

  useEffect(() => {
    let isCurrent = true;
    const establishmentId = localStorage.getItem(
      "prumo:active-establishment-id",
    );

    if (!establishmentId) {
      Promise.resolve().then(() => {
        if (isCurrent) {
          setActiveEstablishmentMissing(true);
          setIsLoading(false);
        }
      });

      return () => {
        isCurrent = false;
      };
    }

    appointmentService
      .getByEstablishment(establishmentId)
      .then((results) => {
        if (isCurrent) {
          setAppointments(
            results.toSorted(
              (first, second) =>
                Date.parse(first.data) - Date.parse(second.data),
            ),
          );
          setActiveEstablishmentMissing(false);
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

  async function cancelAppointment() {
    if (!appointmentToCancel) {
      return;
    }

    const appointment = appointmentToCancel;
    setCancelError("");
    setCancelSuccess("");
    setCancellingAppointmentId(appointment.id);

    try {
      await appointmentService.cancel(appointment.id, appointment.client.cpf);
      setAppointments((current) =>
        current.filter(({ id }) => id !== appointment.id),
      );
      setCancelSuccess(`Agendamento de ${appointment.client.name} cancelado.`);
      setAppointmentToCancel(null);
    } catch (error: unknown) {
      setCancelError(
        getErrorMessage(
          error,
          "Não foi possível cancelar o agendamento. Tente novamente.",
        ),
      );
    } finally {
      setCancellingAppointmentId(null);
    }
  }

  async function checkInAppointment(appointment: Appointment) {
    setCheckInError("");
    setCheckInSuccess("");
    setCheckingInAppointmentId(appointment.id);

    try {
      await appointmentService.checkIn(appointment.id);
      setAppointments((current) =>
        current.map((item) =>
          item.id === appointment.id ? { ...item, status: true } : item,
        ),
      );
      setCheckInSuccess(
        `Check-in de ${appointment.client.name} realizado com sucesso.`,
      );
    } catch (error: unknown) {
      setCheckInError(
        getErrorMessage(
          error,
          "Não foi possível realizar o check-in. Tente novamente.",
        ),
      );
    } finally {
      setCheckingInAppointmentId(null);
    }
  }

  return (
    <>
      <section
        aria-labelledby="upcoming-appointments-title"
        className="rounded-2xl border border-[#D8D4CC] p-2.5"
      >
        <header className="flex items-center justify-between px-1 pb-3">
          <h2
            id="upcoming-appointments-title"
            className="text-lg font-bold sm:text-xl sora"
          >
            Próximos Agendamentos
          </h2>
          <ChevronRight aria-hidden="true" className="size-5 shrink-0" />
        </header>

        {cancelSuccess && (
          <p aria-live="polite" className="px-2 pb-3 text-sm text-green-700">
            {cancelSuccess}
          </p>
        )}
        {checkInError && (
          <p aria-live="assertive" className="px-2 pb-3 text-sm text-red-700">
            {checkInError}
          </p>
        )}
        {checkInSuccess && (
          <p aria-live="polite" className="px-2 pb-3 text-sm text-green-700">
            {checkInSuccess}
          </p>
        )}

        {isLoading ? (
          <p aria-live="polite" className="p-4 text-center text-sm text-[#6B6B6B]">
            Carregando agendamentos...
          </p>
        ) : errorMessage ? (
          <div aria-live="polite" className="p-4 text-center">
            <p className="text-sm text-red-700">{errorMessage}</p>
            <button
              className="mt-3 rounded-xl bg-[#FFCC00] px-4 py-2 text-sm font-medium hover:bg-[#F2C000]"
              onClick={retry}
              type="button"
            >
              Tentar novamente
            </button>
          </div>
        ) : activeEstablishmentMissing ? (
          <p className="p-4 text-center text-sm text-[#6B6B6B]">
            Selecione um estabelecimento para ver os agendamentos.{" "}
            <Link className="font-semibold underline" href="/my-establishments">
              Selecionar
            </Link>
          </p>
        ) : appointments.length === 0 ? (
          <p className="p-4 text-center text-sm text-[#6B6B6B]">
            Nenhum agendamento encontrado.
          </p>
        ) : (
          <ul className="space-y-2">
            {appointments.map((appointment, index) => (
              <li
                key={appointment.id}
                className="relative grid grid-cols-[minmax(80px,0.8fr)_40px_minmax(0,1.8fr)] items-center gap-x-2 gap-y-2 overflow-hidden rounded-2xl border border-[#D8D4CC] px-3 py-2.5 pl-5 shadow-sm sm:grid-cols-[minmax(120px,0.8fr)_44px_minmax(0,1.8fr)] sm:gap-x-3"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-2.5 bg-[#FFCC00]"
                />

                <time className="self-start pt-1 text-xs font-bold sm:text-sm">
                  {formatTimeRange(
                    appointment.data,
                    appointment.service.duration,
                  )}
                </time>

                <div
                  aria-hidden="true"
                  className={`flex size-10 items-center justify-center rounded-full text-xs font-bold sm:size-11 ${avatarColors[index % avatarColors.length]}`}
                >
                  {getInitials(appointment.client.name)}
                </div>

                <div className="min-w-0 self-start pt-0.5 pr-5">
                  <p className="truncate text-xs font-semibold sm:text-sm">
                    {appointment.client.name}
                  </p>
                  <p className="truncate text-xs">{appointment.service.name}</p>
                  <p className="mt-1 truncate text-[11px] text-[#6B6B6B] sm:text-xs">
                    {formatDate(appointment.data)}
                  </p>
                </div>

                <ChevronRight
                  aria-hidden="true"
                  className="absolute right-2.5 top-3 size-4"
                />

                <div className="col-span-3 flex justify-end gap-1.5 sm:col-start-2 sm:col-span-2 sm:gap-2">
                  <button
                    disabled={
                      appointment.status ||
                      checkingInAppointmentId !== null ||
                      cancellingAppointmentId !== null
                    }
                    onClick={() => checkInAppointment(appointment)}
                    type="button"
                    className="min-w-0 flex-1 rounded-xl bg-[#FFCC00] px-2 py-2 text-[11px] font-medium text-[#1C1C1C] transition-colors hover:bg-[#F2C000] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-5 sm:text-xs"
                  >
                    {checkingInAppointmentId === appointment.id
                      ? "Processando..."
                      : appointment.status
                        ? "Check-in feito"
                        : "Check-in"}
                  </button>
                  <button
                    type="button"
                    className="min-w-0 flex-1 rounded-xl border border-[#D8D4CC] bg-transparent px-2 py-2 text-[11px] font-medium transition-colors hover:bg-white/50 sm:flex-none sm:px-4 sm:text-xs"
                  >
                    Reagendar
                  </button>
                  <button
                    disabled={
                      cancellingAppointmentId !== null ||
                      checkingInAppointmentId !== null
                    }
                    onClick={() => {
                      setCancelError("");
                      setCancelSuccess("");
                      setAppointmentToCancel(appointment);
                    }}
                    type="button"
                    className="min-w-0 flex-1 rounded-xl border border-[#D8D4CC] bg-transparent px-2 py-2 text-[11px] font-medium transition-colors hover:bg-white/50 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-5 sm:text-xs"
                  >
                    Cancelar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <AlertDialog
        open={appointmentToCancel !== null}
        onOpenChange={(open) => {
          if (!open && cancellingAppointmentId === null) {
            setAppointmentToCancel(null);
          }
        }}
      >
        <AlertDialogContent className="rounded-2xl border border-[#D8D4CC] bg-white text-[#1C1C1C] shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="normal-case tracking-normal">
              Confirmar cancelamento
            </AlertDialogTitle>
            <AlertDialogDescription>
              {appointmentToCancel
                ? `Deseja cancelar o agendamento de ${appointmentToCancel.client.name} para ${appointmentToCancel.service.name}, em ${formatDate(appointmentToCancel.data)} às ${formatTime(parseAppointmentDate(appointmentToCancel.data))}?`
                : "Deseja cancelar este agendamento?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {cancelError && (
            <p aria-live="assertive" className="text-sm text-red-700">
              {cancelError}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={cancellingAppointmentId !== null}
              className="rounded-xl normal-case tracking-normal"
            >
              Voltar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={cancellingAppointmentId !== null}
              onClick={cancelAppointment}
              className="rounded-xl bg-red-600 normal-case tracking-normal text-white hover:bg-red-700"
            >
              {cancellingAppointmentId !== null
                ? "Cancelando..."
                : "Sim, cancelar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <NewAppointmentButton onCreated={retry} />
    </>
  );
};
