"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  UserRound,
} from "lucide-react";
import { appointmentService } from "@/lib/services";
import type { Appointment } from "@/lib/services/establishments/appointment-service";
import { DashboardPageTitle } from "./PageTitle";

const stats = [
  {
    label: "Agendamentos hoje",
    value: "15",
    icon: CalendarDays,
  },
  {
    label: "Próximo cliente",
    icon: UserRound,
  },
  {
    label: "Total da semana",
    value: "58",
    icon: ChartNoAxesColumnIncreasing,
  },
];

function formatDate(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getCurrentWeekDates() {
  const today = new Date();
  const monday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - ((today.getDay() + 6) % 7),
  );

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return formatDate(date);
  });
}

function getLocalClockTimestamp(date: Date) {
  return Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds(),
  );
}

function getAppointmentTimestamp(dateValue: string) {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?/.exec(
      dateValue,
    );

  if (!match) {
    return Date.parse(dateValue);
  }

  const [, year, month, day, hour, minute, second = "0", fraction = "0"] =
    match;

  return Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
    Number(`0.${fraction}`) * 1_000,
  );
}

function getErrorMessage(error: unknown) {
  const apiMessage = axios.isAxiosError<{
    message?: string;
    error?: string;
  }>(error)
    ? (error.response?.data?.message ?? error.response?.data?.error)
    : undefined;

  return (
    apiMessage ??
    (error instanceof Error
      ? error.message
      : "Não foi possível carregar os agendamentos.")
  );
}

function formatNextAppointment(appointment: Appointment, now: number) {
  const appointmentTime = getAppointmentTimestamp(appointment.data);
  const minutesUntil = Math.ceil((appointmentTime - now) / 60_000);
  const name = appointment.client.name ?? "Cliente";

  if (minutesUntil <= 0) {
    return `${name} agora`;
  }

  if (minutesUntil < 60) {
    return `${name} em ${minutesUntil} min`;
  }

  const time = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(appointmentTime);

  return `${name} às ${time}`;
}

export const GridStats = () => {
  const [todayAppointmentCount, setTodayAppointmentCount] = useState<
    number | null
  >(null);
  const [weeklyAppointmentCount, setWeeklyAppointmentCount] = useState<
    number | null
  >(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  useEffect(() => {
    let isCurrent = true;
    const clockTimeout = window.setTimeout(() => {
      if (isCurrent) {
        setCurrentTime(getLocalClockTimestamp(new Date()));
      }
    }, 0);
    const establishmentId = localStorage.getItem(
      "prumo:active-establishment-id",
    );

    if (!establishmentId) {
      Promise.resolve().then(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

      return () => {
        isCurrent = false;
      };
    }

    const activeEstablishmentId = establishmentId;

    function loadAppointments() {
      setIsLoading(true);
      setErrorMessage("");

      const weekDates = getCurrentWeekDates();
      const todayDate = formatDate(new Date());
      const weekRequests = weekDates.map((date) =>
        appointmentService.getByEstablishment(activeEstablishmentId, { date }),
      );

      Promise.all(weekRequests)
        .then((appointmentsByDay) => {
          if (!isCurrent) {
            return;
          }

          setWeeklyAppointmentCount(
            appointmentsByDay.reduce(
              (total, appointments) => total + appointments.length,
              0,
            ),
          );
          const todayAppointments =
            appointmentsByDay[weekDates.indexOf(todayDate)] ?? [];
          setTodayAppointmentCount(todayAppointments.length);

          const now = getLocalClockTimestamp(new Date());
          setUpcomingAppointments(
            todayAppointments
              .filter(
                (appointment) =>
                  !appointment.status &&
                  getAppointmentTimestamp(appointment.data) > now,
              )
              .toSorted(
                (first, second) =>
                  getAppointmentTimestamp(first.data) -
                  getAppointmentTimestamp(second.data),
              ),
          );
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
    }

    loadAppointments();
    window.addEventListener("prumo:appointments-updated", loadAppointments);
    const timer = window.setInterval(
      () => setCurrentTime(getLocalClockTimestamp(new Date())),
      60_000,
    );

    return () => {
      isCurrent = false;
      window.clearTimeout(clockTimeout);
      window.removeEventListener(
        "prumo:appointments-updated",
        loadAppointments,
      );
      window.clearInterval(timer);
    };
  }, []);

  const nextAppointment =
    currentTime === null
      ? upcomingAppointments[0]
      : upcomingAppointments.find(
          (appointment) =>
            getAppointmentTimestamp(appointment.data) > currentTime,
        );

  return (
    <section aria-labelledby="dashboard-summary-title">
      <DashboardPageTitle
        id="dashboard-summary-title"
        className="mb-4 md:mb-5"
      >
        Resumo
      </DashboardPageTitle>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,0.9fr)] md:gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <article
            key={label}
            className="relative flex min-h-[82px] items-center rounded-lg border border-[#D8D4CC] px-4 py-3 shadow-[0_1px_3px_rgba(28,28,28,0.04)]"
          >
            <div className="min-w-0 pr-8">
              <p className="mb-2 whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.1em] text-[#545454]">
                {label}
              </p>
              <p
                className={`truncate font-bold leading-none ${
                  label === "Próximo cliente" ? "text-sm" : "text-2xl"
                }`}
              >
                {label === "Agendamentos hoje"
                  ? isLoading
                    ? "..."
                    : todayAppointmentCount ?? "—"
                  : label === "Próximo cliente"
                    ? isLoading
                      ? "..."
                      : nextAppointment
                        ? currentTime === null
                          ? "..."
                          : formatNextAppointment(nextAppointment, currentTime)
                        : "Nenhum agendamento próximo"
                    : label === "Total da semana"
                      ? isLoading
                        ? "..."
                        : weeklyAppointmentCount ?? "—"
                      : value}
              </p>
              {errorMessage && (
                <p aria-live="polite" className="mt-1 text-[10px] text-red-700">
                  {errorMessage}
                </p>
              )}
            </div>
            <Icon
              aria-hidden="true"
              className="absolute bottom-4 right-4 size-5 text-[#E6B900]"
              strokeWidth={2.2}
            />
          </article>
        ))}
      </div>
    </section>
  );
};
