import type { Metadata } from "next";
import SearchPage from "./search-page";

export const metadata: Metadata = {
  title: "Encontrar estabelecimentos | Prumo",
  description:
    "Encontre salões, barbearias e serviços de bem-estar para agendar perto de você.",
};

export default function Page() {
  return <SearchPage />;
}
