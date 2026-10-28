"use client";

import { useState, type FormEvent } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { api } from "@/app/lib/api";
import { ownerService } from "../services";

const inputClassName =
  "sora mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#6155F5] focus:ring-2 focus:ring-[#6155F5]/15";

type LoginStatus = {
  type: "error" | "success";
  message: string;
};

function getLoginErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const responseData: unknown = error.response?.data;
    if (
      typeof responseData === "object" &&
      responseData !== null &&
      "message" in responseData &&
      typeof responseData.message === "string"
    ) {
      return responseData.message;
    }
  }

  return "Não foi possível entrar. Verifique sua conexão e tente novamente.";
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<LoginStatus | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const credentials = {
      emailOrCpf: String(formData.get("emailOrCpf")).trim(),
      password: String(formData.get("password")),
    };

    try {
      const response = await ownerService.login(credentials);
      setStatus({ type: "success", message: "Login realizado com sucesso." });
      //Só falta tratar o que ocorre depois do login
    } catch (error: unknown) {
      setStatus({ type: "error", message: getLoginErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="emailOrCpf" className="sora text-sm font-semibold">
          E-mail ou CPF
        </label>
        <input
          autoComplete="username"
          className={inputClassName}
          id="emailOrCpf"
          maxLength={254}
          name="emailOrCpf"
          placeholder="ana@example.com ou seu CPF"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="sora text-sm font-semibold">
          Senha
        </label>
        <div className="relative">
          <input
            autoComplete="current-password"
            className={`${inputClassName} pr-12`}
            id="password"
            name="password"
            placeholder="Digite sua senha"
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
      </div>

      <button
        className="sora flex w-full items-center justify-center gap-3 rounded-full bg-[#FFCC00] px-6 py-4 text-sm font-bold transition hover:bg-[#f0bd00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>

      <p
        aria-live="polite"
        className={`sora min-h-5 text-xs ${
          status?.type === "error" ? "text-red-700" : "text-black/65"
        }`}
      >
        {status?.message}
      </p>
    </form>
  );
}
