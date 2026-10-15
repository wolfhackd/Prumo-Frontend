import type { Metadata } from "next";
import { Suspense } from "react";
import EstablishmentDetails from "./establishment-details";

export const metadata: Metadata = {
  title: "Serviços do estabelecimento | Prumo",
};

type PageProps = {
  params: Promise<{ establishmentId: string }>;
};

async function EstablishmentDetailsRoute({ params }: PageProps) {
  const { establishmentId } = await params;

  return <EstablishmentDetails establishmentId={establishmentId} />;
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <main className="find-page">
          <div className="find-empty find-content-width" role="status">
            <h1>Carregando estabelecimento...</h1>
          </div>
        </main>
      }
    >
      <EstablishmentDetailsRoute params={params} />
    </Suspense>
  );
}
