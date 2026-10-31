import { Suspense } from "react";
import { EstablishmentServicesClient } from "./services-client";

export default function Page({ params }: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f7f7fb] px-4 py-10 sm:px-8">
          <p
            aria-live="polite"
            className="mx-auto max-w-5xl rounded-2xl border border-black/10 bg-white p-8 text-center text-sm text-black/60"
          >
            Carregando serviços...
          </p>
        </main>
      }
    >
      {params.then(({ id }) => (
        <EstablishmentServicesClient id={id} />
      ))}
    </Suspense>
  );
}
