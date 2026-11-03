"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { DashboardPageTitle } from "@/app/dashboard/PageTitle";
import { establishmentService } from "@/lib/services";
import type {
  Establishment,
  EstablishmentBusinessHour,
} from "@/lib/services/establishments/establishment-service";

const daysOfWeek = [
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
  { value: 7, label: "Domingo" },
];

type BusinessHourDraft = EstablishmentBusinessHour & {
  localId: string;
  isNew: boolean;
  isDirty: boolean;
};

const timeInputClassName =
  "mt-1 min-h-11 w-full rounded-xl border border-[#D8D4CC] bg-white px-3 text-sm outline-none transition focus:border-[#6155F5] focus:ring-2 focus:ring-[#6155F5]/15";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
    const message = error.response?.data?.message ?? error.response?.data?.error;
    if (message) {
      return message;
    }
  }

  return error instanceof Error
    ? error.message
    : "Não foi possível concluir a operação. Tente novamente.";
}

function toTimeInputValue(value: string) {
  return value.slice(0, 5);
}

function toDrafts(hours: EstablishmentBusinessHour[]): BusinessHourDraft[] {
  return hours.map((hour) => ({
    ...hour,
    openingTime: toTimeInputValue(hour.openingTime),
    closingTime: toTimeInputValue(hour.closingTime),
    localId: hour.id,
    isNew: false,
    isDirty: false,
  }));
}

export function BusinessHoursSettings() {
  const [establishment, setEstablishment] = useState<Establishment | null>(
    null,
  );
  const [hours, setHours] = useState<BusinessHourDraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [refreshRequired, setRefreshRequired] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeEstablishmentMissing, setActiveEstablishmentMissing] =
    useState(false);
  const [retryCount, setRetryCount] = useState(0);

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

    establishmentService
      .getById(establishmentId)
      .then((result) => {
        if (isCurrent) {
          setEstablishment(result);
          setHours(toDrafts(result.businessHours));
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

  function addHour(dayOfWeek: number) {
    setActionError("");
    setSuccessMessage("");
    setHours((current) => [
      ...current,
      {
        id: "",
        localId: crypto.randomUUID(),
        dayOfWeek,
        openingTime: "09:00",
        closingTime: "18:00",
        isNew: true,
        isDirty: true,
      },
    ]);
  }

  function updateHour(
    localId: string,
    field: "openingTime" | "closingTime",
    value: string,
  ) {
    setActionError("");
    setSuccessMessage("");
    setHours((current) =>
      current.map((hour) =>
        hour.localId === localId
          ? { ...hour, [field]: value, isDirty: true }
          : hour,
      ),
    );
  }

  async function removeHour(hour: BusinessHourDraft) {
    setActionError("");
    setSuccessMessage("");

    if (hour.isNew) {
      setHours((current) =>
        current.filter(({ localId }) => localId !== hour.localId),
      );
      return;
    }

    if (!establishment) {
      return;
    }

    setIsSaving(true);
    try {
      await establishmentService.deleteBusinessHour(hour.id);
      setHours((current) =>
        current.filter(({ localId }) => localId !== hour.localId),
      );
      setEstablishment((current) =>
        current
          ? {
              ...current,
              businessHours: current.businessHours.filter(
                ({ id }) => id !== hour.id,
              ),
            }
          : current,
      );
      setSuccessMessage("Horário de funcionamento removido.");

      try {
        setEstablishment(await establishmentService.getById(establishment.id));
      } catch (error: unknown) {
        setRefreshRequired(true);
        setSuccessMessage("");
        setActionError(
          `O horário foi removido, mas não foi possível atualizar os dados do estabelecimento: ${getErrorMessage(error)}`,
        );
      }
    } catch (error: unknown) {
      setActionError(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSave(hour: BusinessHourDraft) {
    if (!establishment || (!hour.isNew && !hour.isDirty)) {
      return;
    }

    setActionError("");
    setSuccessMessage("");

    if (
      !hour.openingTime ||
      !hour.closingTime ||
      hour.openingTime >= hour.closingTime
    ) {
      const dayName =
        daysOfWeek.find(({ value }) => value === hour.dayOfWeek)
          ?.label ?? "selecionado";
      setActionError(
        `Confira os horários de ${dayName}: a abertura deve ser anterior ao fechamento.`,
      );
      return;
    }

    setIsSaving(true);
    let mutationCompleted = false;
    try {
      const data = {
        establishmentId: establishment.id,
        dayOfWeek: hour.dayOfWeek,
        openingTime: hour.openingTime,
        closingTime: hour.closingTime,
      };

      if (hour.isNew) {
        await establishmentService.registerBusinessHour(data);
      } else {
        await establishmentService.updateBusinessHour(hour.id, {
          dayOfWeek: data.dayOfWeek,
          openingTime: data.openingTime,
          closingTime: data.closingTime,
        });
      }
      mutationCompleted = true;

      const refreshedEstablishment = await establishmentService.getById(
        establishment.id,
      );
      const savedHour = refreshedEstablishment.businessHours.find(
        (candidate) =>
          candidate.id === hour.id ||
          (hour.isNew &&
            candidate.dayOfWeek === hour.dayOfWeek &&
            toTimeInputValue(candidate.openingTime) === hour.openingTime &&
            toTimeInputValue(candidate.closingTime) === hour.closingTime &&
            !hours.some(({ id }) => id === candidate.id)),
      );

      if (!savedHour) {
        throw new Error(
          "O horário foi enviado, mas não foi encontrado ao atualizar a lista.",
        );
      }

      setEstablishment(refreshedEstablishment);
      setHours((current) =>
        current.map((currentHour) =>
          currentHour.localId === hour.localId
            ? {
                ...savedHour,
                openingTime: toTimeInputValue(savedHour.openingTime),
                closingTime: toTimeInputValue(savedHour.closingTime),
                localId: savedHour.id,
                isNew: false,
                isDirty: false,
              }
            : currentHour,
        ),
      );
      setSuccessMessage("Horário de funcionamento atualizado.");
    } catch (error: unknown) {
      if (mutationCompleted) {
        setRefreshRequired(true);
        setActionError(
          `O horário foi enviado, mas houve um problema ao confirmar a atualização: ${getErrorMessage(error)} Atualize a página antes de tentar novamente.`,
        );
      } else {
        setActionError(getErrorMessage(error));
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <header className="mb-6">
        <p className="text-sm font-semibold text-[#6155F5]">Estabelecimento</p>
        <DashboardPageTitle className="mt-1 text-[#171717]">
          Configurações
        </DashboardPageTitle>
        <p className="mt-2 text-sm text-black/60">
          Defina os horários de funcionamento do seu estabelecimento.
          {establishment && (
            <>
              {" "}
              <span className="font-semibold">{establishment.name}</span>
            </>
          )}
        </p>
      </header>

      {isLoading ? (
        <p
          aria-live="polite"
          className="rounded-2xl border border-[#D8D4CC] bg-white p-8 text-center text-sm text-black/60"
        >
          Carregando horários...
        </p>
      ) : activeEstablishmentMissing ? (
        <section className="rounded-2xl border border-[#D8D4CC] bg-white p-8 text-center">
          <h2 className="text-lg font-semibold">
            Selecione um estabelecimento
          </h2>
          <p className="mt-2 text-sm text-black/60">
            Escolha qual estabelecimento você quer configurar.
          </p>
          <Link
            className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#FFCC00] px-5 text-sm font-bold text-[#171717] transition hover:bg-[#f0bd00]"
            href="/my-establishments"
          >
            Escolher estabelecimento
          </Link>
        </section>
      ) : errorMessage ? (
        <section
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
        </section>
      ) : establishment ? (
        <section
          aria-labelledby="business-hours-title"
          className="rounded-2xl border border-[#D8D4CC] bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="mb-5">
            <h2
              className="text-lg font-bold text-[#171717]"
              id="business-hours-title"
            >
              Horários de funcionamento
            </h2>
            <p className="mt-1 text-sm text-black/60">
              Adicione um ou mais períodos para cada dia. Deixe o dia sem
              períodos se o estabelecimento não funcionar.
              {" "}Salve cada período separadamente.
            </p>
          </div>

          <div className="space-y-4">
            {daysOfWeek.map(({ value, label }) => {
              const dayHours = hours.filter(
                (hour) => hour.dayOfWeek === value,
              );

              return (
                <article
                  className="rounded-2xl border border-[#D8D4CC] bg-[#FBFAF7] p-4 sm:p-5"
                  key={value}
                >
                  <div>
                    <h3 className="font-semibold text-[#171717]">{label}</h3>
                    <p className="mt-1 text-xs text-black/55">
                      {dayHours.length === 0
                        ? "Fechado"
                        : `${dayHours.length} ${dayHours.length === 1 ? "período" : "períodos"} de funcionamento`}
                    </p>
                  </div>

                  <div
                    className={
                      dayHours.length > 0
                        ? "mt-4 border-t border-[#D8D4CC]/70 pt-4"
                        : "mt-3"
                    }
                  >
                    {dayHours.length > 0 && (
                      <div className="space-y-3">
                        {dayHours.map((hour, index) => (
                          <div
                            className="grid grid-cols-2 items-end gap-2 rounded-xl border border-[#E8E4DC] bg-white p-3 sm:gap-3 sm:p-4"
                            key={hour.localId}
                          >
                            <div className="min-w-0">
                              <label
                                className="text-xs font-medium text-black/60"
                                htmlFor={`opening-${hour.localId}`}
                              >
                                {index === 0
                                  ? "Abertura"
                                  : `Abertura ${index + 1}`}
                              </label>
                              <input
                                className={timeInputClassName}
                                id={`opening-${hour.localId}`}
                                onChange={(event) =>
                                  updateHour(
                                    hour.localId,
                                    "openingTime",
                                    event.target.value,
                                  )
                                }
                                required
                                type="time"
                                value={hour.openingTime}
                                disabled={isSaving || refreshRequired}
                              />
                            </div>
                            <div className="min-w-0">
                              <label
                                className="text-xs font-medium text-black/60"
                                htmlFor={`closing-${hour.localId}`}
                              >
                                Fechamento
                              </label>
                              <input
                                className={timeInputClassName}
                                id={`closing-${hour.localId}`}
                                onChange={(event) =>
                                  updateHour(
                                    hour.localId,
                                    "closingTime",
                                    event.target.value,
                                  )
                                }
                                required
                                type="time"
                                value={hour.closingTime}
                                disabled={isSaving || refreshRequired}
                              />
                            </div>
                            <div className="col-span-2 flex justify-end gap-2">
                              <button
                                aria-label={`Remover período de ${label}`}
                                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-red-200 bg-white px-3 text-red-700 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-wait disabled:opacity-60"
                                disabled={isSaving || refreshRequired}
                                onClick={() => removeHour(hour)}
                                type="button"
                              >
                                <Trash2 aria-hidden="true" className="size-4" />
                              </button>
                              <button
                                className="min-h-11 rounded-xl bg-[#FFCC00] px-4 text-sm font-bold text-[#171717] transition hover:bg-[#f0bd00] disabled:cursor-wait disabled:opacity-60"
                                disabled={
                                  isSaving ||
                                  refreshRequired ||
                                  (!hour.isNew && !hour.isDirty)
                                }
                                onClick={() => handleSave(hour)}
                                type="button"
                              >
                                {isSaving
                                  ? "Salvando..."
                                  : hour.isNew
                                    ? "Adicionar horário"
                                    : hour.isDirty
                                      ? "Salvar horário"
                                      : "Salvo"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#C9C4B9] bg-white px-4 text-sm font-semibold text-[#444] transition hover:border-[#D9AE00] hover:bg-[#FFCC00]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6155F5] sm:w-auto"
                      onClick={() => addHour(value)}
                      disabled={isSaving || refreshRequired}
                      type="button"
                    >
                      <Plus aria-hidden="true" className="size-4" />
                      Adicionar período
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {actionError && (
            <p className="mt-4 text-sm text-red-700" role="alert">
              {actionError}
            </p>
          )}
          {successMessage && (
            <p className="mt-4 text-sm text-green-700" role="status">
              {successMessage}
            </p>
          )}

        </section>
      ) : null}
    </>
  );
}
