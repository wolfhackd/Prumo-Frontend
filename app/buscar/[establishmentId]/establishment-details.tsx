"use client";

import Link from "next/link";
import { useSearchPage } from "../use-search-page";
import { SearchFooter } from "../search-layout";
import { BrandMark, PinIcon } from "../search-icons";
import BookingPanel from "../booking-panel";

type EstablishmentDetailsProps = {
  establishmentId: string;
};

function getWebsiteHref(website: string) {
  try {
    const candidate = /^https?:\/\//i.test(website)
      ? website
      : `https://${website}`;
    const url = new URL(candidate);

    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export default function EstablishmentDetails({
  establishmentId,
}: EstablishmentDetailsProps) {
  const search = useSearchPage();
  const business = search.searchBusinesses.find(
    (item) => item.establishmentId === establishmentId,
  );
  const website = business?.website?.trim() ?? "";
  const websiteHref = website ? getWebsiteHref(website) : null;
  const bookingBusinessId = business?.establishmentId ?? business?.initials;
  const hasActiveBooking =
    search.bookingService?.businessInitials === bookingBusinessId;
  const activeBookingService = hasActiveBooking ? search.bookingService : null;

  return (
    <main className="find-page">
      <header className="find-header">
        <Link className="brand" href="/" aria-label="Prumo — início">
          <BrandMark />
          <span>prumo</span>
        </Link>
        <Link className="find-back-link" href="/buscar">
          Voltar à busca
        </Link>
      </header>

      <div className="establishment-detail-content find-content-width">
        {search.isLoadingDirectory ? (
          <div className="find-empty" role="status">
            <h1>Carregando estabelecimento...</h1>
          </div>
        ) : search.directoryError ? (
          <div className="find-empty" role="alert">
            <h1>Não foi possível carregar o estabelecimento</h1>
            <p>{search.directoryError}</p>
          </div>
        ) : !business ? (
          <div className="find-empty" role="status">
            <h1>Estabelecimento não encontrado</h1>
            <p>Ele pode ter sido removido ou não estar disponível no catálogo.</p>
            <Link className="find-empty-button" href="/buscar">
              Voltar à busca
            </Link>
          </div>
        ) : (
          <>
            <section
              aria-labelledby="establishment-title"
              className="establishment-detail-profile"
            >
              <span className="find-section-label">{business.category}</span>
              <h1 id="establishment-title">{business.name}</h1>
              <p className="establishment-detail-location">
                <PinIcon />
                {business.detail}
              </p>
              <div className="establishment-detail-website">
                <span>Website</span>
                {websiteHref ? (
                  <a href={websiteHref} rel="noreferrer" target="_blank">
                    {website}
                  </a>
                ) : (
                  <span>{website || "Não informado"}</span>
                )}
              </div>
            </section>

            <section
              aria-labelledby="establishment-services-title"
              className="establishment-detail-services"
            >
              <div className="find-service-list-heading">
                <div>
                  <span className="find-section-label">CATÁLOGO</span>
                  <h2 id="establishment-services-title">Todos os serviços</h2>
                </div>
                <span>
                  {business.services.length}{" "}
                  {business.services.length === 1
                    ? "opção disponível"
                    : "opções disponíveis"}
                </span>
              </div>

              {business.services.length > 0 ? (
                <ul className="find-service-list">
                  {business.services.map((service) => (
                    <li key={service.name}>
                      <span>
                        <strong>{service.name}</strong>
                        <small>{service.duration || "Duração não informada"}</small>
                      </span>
                      <span className="find-service-price">
                        <strong>{service.price}</strong>
                        <button
                          aria-label={`Agendar ${service.name} por ${service.price}`}
                          className="find-service-book"
                          onClick={() =>
                            search.startBooking(
                              bookingBusinessId ?? establishmentId,
                              service.name,
                            )
                          }
                          type="button"
                        >
                          Agendar
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="find-service-status">
                  Este estabelecimento ainda não cadastrou serviços ativos.
                </p>
              )}

              {business && activeBookingService && (
                <BookingPanel
                  business={business}
                  bookingService={activeBookingService}
                  bookingDays={search.bookingDays}
                  selectedDate={search.selectedDate}
                  selectedTime={search.selectedTime}
                  appointment={search.appointment}
                  savedAppointments={search.savedAppointments}
                  bookingError={search.bookingError}
                  onSelectDate={search.selectBookingDate}
                  onSelectTime={search.setSelectedTime}
                  onSelectService={(serviceName) =>
                    search.selectBookingService(
                      bookingBusinessId ?? establishmentId,
                      serviceName,
                    )
                  }
                  onStartAnother={search.startAnotherAppointment}
                  onSave={(customerName, contact) =>
                    search.saveAppointment(
                      business,
                      activeBookingService.serviceName,
                      customerName,
                      contact,
                    )
                  }
                />
              )}
            </section>
          </>
        )}
      </div>
      <SearchFooter />
    </main>
  );
}
