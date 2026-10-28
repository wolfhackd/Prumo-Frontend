"use client";

import { useRef, useState, type FormEvent } from "react";
import { ownerService } from "@/app/services/index";
import { Eye, EyeOff } from "lucide-react";
import { OwnerCreateData } from "../services/owner/types";
import { useRouter } from "next/navigation";

const inputClassName =
  "sora mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#6155F5] focus:ring-2 focus:ring-[#6155F5]/15";

export function OwnerRegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionLock = useRef(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submissionLock.current) {
      return;
    }

    submissionLock.current = true;
    setIsSubmitting(true);
    setStatus("Criando sua conta...");

    try {
      const formData = new FormData(event.currentTarget);
      const data = {
        name: formData.get("name"),
        cpf: formData.get("cpf"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        password: formData.get("password"),
      } as OwnerCreateData;

      await ownerService.create(data);
      setStatus("Cadastro realizado com sucesso");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: unknown) {
      setStatus(
        error instanceof Error ? error.message : "Erro ao cadastrar",
      );
      submissionLock.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <form
      aria-busy={isSubmitting}
      className="space-y-5"
      onSubmit={handleSubmit}
    >
      <fieldset className="space-y-5" disabled={isSubmitting}>
      <div>
        <label htmlFor="name" className="sora text-sm font-semibold">
          Nome completo
        </label>
        <input
          autoComplete="name"
          className={inputClassName}
          id="name"
          maxLength={120}
          name="name"
          placeholder="Ex.: Ana Souza"
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cpf" className="sora text-sm font-semibold">
            CPF
          </label>
          <input
            autoComplete="off"
            className={inputClassName}
            id="cpf"
            inputMode="numeric"
            maxLength={11}
            minLength={11}
            name="cpf"
            pattern="[0-9]{11}"
            placeholder="Somente números"
            required
            title="Informe os 11 números do CPF, sem pontos ou traços."
          />
        </div>

        <div>
          <label htmlFor="phone" className="sora text-sm font-semibold">
            Telefone
          </label>
          <input
            autoComplete="tel"
            className={inputClassName}
            id="phone"
            maxLength={16}
            name="phone"
            placeholder="+5511999999999"
            required
            type="tel"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="sora text-sm font-semibold">
          E-mail
        </label>
        <input
          autoComplete="email"
          className={inputClassName}
          id="email"
          maxLength={254}
          name="email"
          placeholder="voce@exemplo.com"
          required
          type="email"
        />
      </div>

      <div>
        <label htmlFor="password" className="sora text-sm font-semibold">
          Senha
        </label>
        <div className="relative">
          <input
            autoComplete="new-password"
            className={`${inputClassName} pr-12`}
            id="password"
            minLength={8}
            name="password"
            placeholder="Crie uma senha segura"
            required
            type={showPassword ? "text" : "password"}
          />
          <button
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-black/55 transition hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6155F5]"
            onClick={() => setShowPassword((visible) => !visible)}
            type="button"
          >
            {showPassword ? (
              <EyeOff size={18} aria-hidden="true" />
            ) : (
              <Eye size={18} aria-hidden="true" />
            )}
          </button>
        </div>
        <p className="sora mt-2 text-xs text-black/55">
          Use pelo menos 8 caracteres.
        </p>
      </div>

      <button
        className="sora flex w-full items-center justify-center gap-3 rounded-full bg-[#FFCC00] px-6 py-4 text-sm font-bold cursor-pointer transition hover:bg-[#f0bd00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
      >
        {isSubmitting ? "Criando sua conta..." : "Criar minha conta"}
      </button>
      </fieldset>

      <p aria-live="polite" className="sora min-h-5 text-xs text-black/65">
        {status}
      </p>
    </form>
  );
}
