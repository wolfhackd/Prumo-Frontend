"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { establishmentService, serviceService } from "@/lib/services";
import type {
  Establishment,
  EstablishmentServiceItem,
} from "@/lib/services/establishments/establishment-service";
import type {
  ServiceData,
  ServiceUpdateData,
} from "@/lib/services/establishments/service-service";
import { DashboardPageTitle } from "../dashboard/PageTitle";

const inputClassName =
  "mt-2 w-full rounded-xl border border-[#D8D4CC] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#6155F5] focus:ring-2 focus:ring-[#6155F5]/15";

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
    const message =
      error.response?.data?.message ?? error.response?.data?.error;
    if (message) {
      return message;
    }
  }

  return error instanceof Error
    ? error.message
    : "Não foi possível concluir a operação. Tente novamente.";
}

export function ServicesManagementClient() {
  const [establishment, setEstablishment] = useState<Establishment | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeEstablishmentMissing, setActiveEstablishmentMissing] =
    useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] =
    useState<EstablishmentServiceItem | null>(null);
  const [deletingService, setDeletingService] =
    useState<EstablishmentServiceItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    const establishId = localStorage.getItem("prumo:active-establishment-id");

    if (!establishId) {
      Promise.resolve().then(() => {
        if (isCurrent) {
          setEstablishment(null);
          setActiveEstablishmentMissing(true);
          setIsLoading(false);
        }
      });
      return () => {
        isCurrent = false;
      };
    }

    establishmentService
      .getById(establishId)
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
  }, [retryCount]);

  async function refreshEstablishment(establishId: string) {
    try {
      const result = await establishmentService.getById(establishId);
      setEstablishment(result);
      setLoadError("");
    } catch (error: unknown) {
      setLoadError(
        `A alteração foi salva, mas não foi possível atualizar a lista: ${getErrorMessage(error)}`,
      );
    }
  }

  function openCreateForm() {
    setActionError("");
    setEditingService(null);
    setIsFormOpen(true);
  }

  function openEditForm(service: EstablishmentServiceItem) {
    setActionError("");
    setEditingService(service);
    setIsFormOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!establishment) {
      return;
    }

    setActionError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name")).trim();
    const price = Number(formData.get("price"));
    const duration = Number(formData.get("duration"));

    try {
      if (editingService) {
        const data: ServiceUpdateData = { name, price, duration };
        await serviceService.update(editingService.id, data);
      } else {
        const data: ServiceData = {
          name,
          description: String(formData.get("description")).trim() || null,
          price,
          duration,
          establishId: establishment.id,
        };
        await serviceService.create(data);
      }

      setIsFormOpen(false);
      setEditingService(null);
      await refreshEstablishment(establishment.id);
    } catch (error: unknown) {
      setActionError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!establishment || !deletingService) {
      return;
    }

    setActionError("");
    setIsDeleting(true);

    try {
      await serviceService.delete(deletingService.id);
      setDeletingService(null);
      await refreshEstablishment(establishment.id);
    } catch (error: unknown) {
      setActionError(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  }

  function retry() {
    setIsLoading(true);
    setLoadError("");
    setRetryCount((count) => count + 1);
  }

  return (
    <>
      <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#6155F5]">Gerenciamento</p>
          <DashboardPageTitle className="mt-1 text-[#171717]">
            Serviços
          </DashboardPageTitle>
          {establishment && (
            <p className="mt-2 text-sm text-black/60">
              Serviços de{" "}
              <span className="font-semibold">{establishment.name}</span>
            </p>
          )}
        </div>
        {establishment && (
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#FFCC00] px-5 text-sm font-bold text-[#171717] transition hover:bg-[#f0bd00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            onClick={openCreateForm}
            type="button"
          >
            + Novo serviço
          </button>
        )}
      </header>

      {isLoading ? (
        <p
          aria-live="polite"
          className="rounded-2xl border border-[#D8D4CC] bg-white p-8 text-center text-sm text-black/60"
        >
          Carregando serviços...
        </p>
      ) : activeEstablishmentMissing ? (
        <section className="rounded-2xl border border-[#D8D4CC] bg-white p-8 text-center">
          <h2 className="text-lg font-semibold">
            Selecione um estabelecimento
          </h2>
          <p className="mt-2 text-sm text-black/60">
            Escolha qual estabelecimento você quer gerenciar antes de cadastrar
            os serviços.
          </p>
          <Link
            className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#FFCC00] px-5 text-sm font-bold text-[#171717] transition hover:bg-[#f0bd00]"
            href="/my-establishments"
          >
            Escolher estabelecimento
          </Link>
        </section>
      ) : loadError ? (
        <section
          aria-live="polite"
          className="rounded-2xl border border-red-200 bg-white p-8 text-center"
        >
          <p className="text-sm text-red-700">{loadError}</p>
          <button
            className="mt-4 rounded-full bg-[#6155F5] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#5145e5]"
            onClick={retry}
            type="button"
          >
            Tentar novamente
          </button>
        </section>
      ) : establishment ? (
        <>
          {actionError && (
            <p
              className="mb-4 rounded-xl border border-red-200 bg-white p-4 text-sm text-red-700"
              role="alert"
            >
              {actionError}
            </p>
          )}
          {establishment.services.length === 0 ? (
            <section className="rounded-2xl border border-[#D8D4CC] bg-white p-8 text-center">
              <h2 className="text-lg font-semibold">
                Nenhum serviço cadastrado
              </h2>
              <p className="mt-2 text-sm text-black/60">
                Cadastre o primeiro serviço para este estabelecimento.
              </p>
              <button
                className="mt-5 rounded-full bg-[#FFCC00] px-5 py-3 text-sm font-bold text-[#171717] transition hover:bg-[#f0bd00]"
                onClick={openCreateForm}
                type="button"
              >
                Criar serviço
              </button>
            </section>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {establishment.services.map((service) => (
                <li
                  className="flex flex-col rounded-2xl border border-[#D8D4CC] bg-white p-5 shadow-sm"
                  key={service.id}
                >
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-[#171717]">
                      {service.name}
                    </h2>
                    {service.description && (
                      <p className="mt-2 whitespace-pre-wrap text-sm text-black/60">
                        {service.description}
                      </p>
                    )}
                    <p className="mt-4 text-sm font-semibold text-[#5145e5]">
                      {formatPrice(service.price)} · {service.duration} min
                    </p>
                  </div>
                  <div className="mt-5 flex gap-2 border-t border-[#D8D4CC] pt-4">
                    <button
                      className="min-h-10 flex-1 rounded-xl border border-[#D8D4CC] px-4 text-sm font-semibold transition hover:bg-[#F3F0E9]"
                      onClick={() => openEditForm(service)}
                      type="button"
                    >
                      Editar
                    </button>
                    <button
                      className="min-h-10 flex-1 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                      onClick={() => {
                        setActionError("");
                        setDeletingService(service);
                      }}
                      type="button"
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}

      {isFormOpen && establishment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <section
            aria-labelledby="service-form-title"
            aria-modal="true"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-[#F3F0E9] p-5 shadow-xl sm:p-7"
            role="dialog"
          >
            <h2 className="text-xl font-bold" id="service-form-title">
              {editingService ? "Editar serviço" : "Novo serviço"}
            </h2>
            <p className="mt-1 text-sm text-black/60">
              Este serviço será vinculado a {establishment.name}.
            </p>
            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <fieldset className="space-y-4" disabled={isSubmitting}>
                <div>
                  <label
                    className="text-sm font-semibold"
                    htmlFor="service-name"
                  >
                    Nome
                  </label>
                  <input
                    autoFocus
                    className={inputClassName}
                    defaultValue={editingService?.name ?? ""}
                    id="service-name"
                    maxLength={120}
                    name="name"
                    placeholder="Ex.: Corte de cabelo"
                    required
                  />
                </div>
                <div>
                  <label
                    className="text-sm font-semibold"
                    htmlFor="service-description"
                  >
                    Descrição{" "}
                    <span className="font-normal text-black/50">
                      (opcional)
                    </span>
                  </label>
                  <textarea
                    className={inputClassName}
                    defaultValue={editingService?.description ?? ""}
                    id="service-description"
                    maxLength={1000}
                    name="description"
                    rows={3}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      className="text-sm font-semibold"
                      htmlFor="service-price"
                    >
                      Preço (R$)
                    </label>
                    <input
                      className={inputClassName}
                      defaultValue={editingService?.price ?? ""}
                      id="service-price"
                      min="0"
                      name="price"
                      required
                      step="0.01"
                      type="number"
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-semibold"
                      htmlFor="service-duration"
                    >
                      Duração (minutos)
                    </label>
                    <input
                      className={inputClassName}
                      defaultValue={editingService?.duration ?? 30}
                      id="service-duration"
                      min={editingService ? "1" : "30"}
                      name="duration"
                      required
                      step={editingService ? "1" : "30"}
                      type="number"
                    />
                    <p className="mt-1 text-xs text-black/50">
                      {editingService
                        ? "Informe a duração em minutos."
                        : "Informe blocos de 30 minutos."}
                    </p>
                  </div>
                </div>
              </fieldset>
              {actionError && (
                <p className="text-sm text-red-700" role="alert">
                  {actionError}
                </p>
              )}
              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <button
                  className="min-h-11 rounded-full border border-[#D8D4CC] px-5 text-sm font-semibold transition hover:bg-white disabled:opacity-60"
                  disabled={isSubmitting}
                  onClick={() => {
                    setIsFormOpen(false);
                    setActionError("");
                  }}
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  className="min-h-11 rounded-full bg-[#FFCC00] px-5 text-sm font-bold transition hover:bg-[#f0bd00] disabled:cursor-wait disabled:opacity-60"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting
                    ? "Salvando..."
                    : editingService
                      ? "Salvar alterações"
                      : "Criar serviço"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deletingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <section
            aria-labelledby="delete-service-title"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            role="dialog"
          >
            <h2 className="text-lg font-bold" id="delete-service-title">
              Excluir serviço?
            </h2>
            <p className="mt-2 text-sm text-black/60">
              O serviço{" "}
              <span className="font-semibold">{deletingService.name}</span> será
              removido permanentemente.
            </p>
            {actionError && (
              <p className="mt-3 text-sm text-red-700" role="alert">
                {actionError}
              </p>
            )}
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                className="min-h-11 rounded-full border border-[#D8D4CC] px-5 text-sm font-semibold transition hover:bg-[#F3F0E9] disabled:opacity-60"
                disabled={isDeleting}
                onClick={() => {
                  setDeletingService(null);
                  setActionError("");
                }}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="min-h-11 rounded-full bg-red-600 px-5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
                disabled={isDeleting}
                onClick={handleDelete}
                type="button"
              >
                {isDeleting ? "Excluindo..." : "Excluir serviço"}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
