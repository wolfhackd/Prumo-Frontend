import type { Metadata } from "next";
import { CreateEstablishmentForm } from "./create-establishment-form";

export const metadata: Metadata = {
  title: "Criar estabelecimento — Prumo",
  description: "Cadastre um estabelecimento para começar a organizar seu negócio.",
};

export default function CreateEstablishmentPage() {
  return <CreateEstablishmentForm />;
}
