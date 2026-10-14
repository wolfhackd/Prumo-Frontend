import type { Metadata } from "next";
import ManagementPage from "./management-page";

export const metadata: Metadata = {
  title: "Gestão do negócio | Prumo",
  description:
    "Gerencie seus estabelecimentos e serviços em um só lugar com o Prumo.",
};

export default function Page() {
  return <ManagementPage />;
}
