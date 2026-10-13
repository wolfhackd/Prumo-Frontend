"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import {
  businesses,
  businessCategories,
  filterBusinesses,
  type BusinessCategory,
} from "../establishments";

type SortOrder = "relevance" | "rating";

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <path
          d="M8 22.5 16 7l8 15.5"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 18h10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <circle
        cx="10.8"
        cy="10.8"
        r="6.3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m15.5 15.5 4.1 4.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path
        d="M4 10h11M10 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<BusinessCategory>("Todos");
  const [sortOrder, setSortOrder] = useState<SortOrder>("relevance");
  const [expandedBusiness, setExpandedBusiness] = useState<string | null>(null);

  const results = useMemo(() => {
    const filtered = filterBusinesses(searchTerm, location, category);

    if (sortOrder === "rating") {
      return [...filtered].sort(
        (first, second) => second.numericRating - first.numericRating,
      );
    }

    return filtered;
  }, [category, location, searchTerm, sortOrder]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function clearFilters() {
    setSearchTerm("");
    setLocation("");
    setCategory("Todos");
    setSortOrder("relevance");
    setExpandedBusiness(null);
  }

  const hasFilters =
    Boolean(searchTerm.trim()) ||
    Boolean(location.trim()) ||
    category !== "Todos";

  return (
    <main className="find-page">
      <header className="find-header">
        <Link className="brand" href="/" aria-label="Prumo — início">
          <BrandMark />
          <span>prumo</span>
        </Link>
        <Link className="find-back-link" href="/">
          Voltar ao início
        </Link>
      </header>

      <section className="find-hero">
        <div className="find-content-width">
          <span className="find-eyebrow">
            <span />
            SEU PRÓXIMO HORÁRIO COMEÇA AQUI
          </span>
          <h1>
            Um lugar que combina
            <br />
            <span>com o seu momento.</span>
          </h1>
          <p className="find-intro">
            Pesquise estabelecimentos e serviços e encontre uma opção perto de
            você.
          </p>

          <form className="find-form" role="search" onSubmit={handleSubmit}>
            <label className="find-field">
              <SearchIcon />
              <span className="visually-hidden">Serviço ou estabelecimento</span>
              <input
                autoComplete="off"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="O que você procura?"
                type="search"
                value={searchTerm}
              />
            </label>
            <span className="find-form-divider" />
            <label className="find-field find-location-field">
              <PinIcon />
              <span className="visually-hidden">Bairro ou cidade</span>
              <input
                autoComplete="address-level2"
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Bairro ou cidade"
                type="search"
                value={location}
              />
            </label>
            <button className="find-submit" type="submit">
              <SearchIcon />
              <span>Buscar</span>
            </button>
          </form>

          <div className="find-location-hint">
            <PinIcon />
            <span>Explore opções em São Paulo</span>
          </div>
        </div>
      </section>

      <section className="find-results find-content-width" aria-labelledby="results-title">
        <div className="find-results-top">
          <div>
            <span className="find-section-label">LUGARES PARA VOCÊ</span>
            <h2 id="results-title">
              {hasFilters ? "Resultados da busca" : "Descubra lugares perto de você"}
            </h2>
          </div>
          <label className="find-sort">
            <span>Ordenar por</span>
            <select
              onChange={(event) =>
                setSortOrder(event.target.value as SortOrder)
              }
              value={sortOrder}
            >
              <option value="relevance">Relevância</option>
              <option value="rating">Melhor avaliados</option>
            </select>
          </label>
        </div>

        <div aria-label="Filtrar por categoria" className="find-categories">
          {businessCategories.map((item) => (
            <button
              aria-pressed={category === item}
              className={`find-category${category === item ? " selected" : ""}`}
              key={item}
              onClick={() => setCategory(item)}
              type="button"
            >
              {item}
              <span>
                {item === "Todos"
                  ? businesses.length
                  : businesses.filter(
                      (business) => business.categoryFilter === item,
                    ).length}
              </span>
            </button>
          ))}
          {(searchTerm || location || category !== "Todos") && (
            <button className="find-clear" onClick={clearFilters} type="button">
              Limpar filtros
            </button>
          )}
        </div>

        <div className="find-count" aria-live="polite">
          <strong>
            {results.length} {results.length === 1 ? "estabelecimento" : "estabelecimentos"}
          </strong>
          <span>
            {location.trim()
              ? `para "${location.trim()}"`
              : "com agendamento pelo Prumo"}
          </span>
        </div>

        {results.length > 0 ? (
          <div className="find-list" aria-live="polite">
            {results.map((business) => {
              const expanded = expandedBusiness === business.initials;

              return (
                <article className="find-card" key={business.initials}>
                  <div
                    className={`find-card-art find-art-${business.tone}`}
                    aria-hidden="true"
                  >
                    <span>{business.initials}</span>
                    <i>✳</i>
                  </div>
                  <div className="find-card-main">
                    <div className="find-card-title-row">
                      <div>
                        <span className="find-card-category">
                          {business.category}
                        </span>
                        <h3>{business.name}</h3>
                      </div>
                      <span className="find-rating">
                        <span aria-hidden="true">★</span> {business.rating}
                      </span>
                    </div>
                    <p className="find-card-location">
                      <PinIcon />
                      {business.detail}
                    </p>
                    <div className="find-card-footer">
                      <div className="find-service-summary">
                        <span>Serviço em destaque</span>
                        <strong>{business.service}</strong>
                      </div>
                      <div className="find-price">
                        <strong>{business.price}</strong>
                        <span>· {business.duration}</span>
                      </div>
                      <button
                        aria-expanded={expanded}
                        className="find-card-action"
                        onClick={() =>
                          setExpandedBusiness(expanded ? null : business.initials)
                        }
                        type="button"
                      >
                        {expanded ? "Ocultar serviço" : "Ver serviço"}
                        <ArrowIcon />
                      </button>
                    </div>
                    {expanded && (
                      <div className="find-service-details">
                        <span className="find-service-check">✓</span>
                        <span>
                          <strong>{business.service}</strong>
                          <small>
                            {business.duration} · a partir de {business.price}
                          </small>
                        </span>
                        <span className="find-service-status">
                          Consulte horários no estabelecimento
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="find-empty" role="status">
            <span className="find-empty-icon">
              <SearchIcon />
            </span>
            <h3>Nenhum estabelecimento encontrado</h3>
            <p>
              Não encontramos resultados com esses filtros. Tente outro serviço
              ou bairro.
            </p>
            <button className="find-empty-button" onClick={clearFilters} type="button">
              Limpar busca
            </button>
          </div>
        )}

        <p className="find-demo-note">
          <span aria-hidden="true">✳</span>
          Você pode pesquisar sem criar uma conta. Os estabelecimentos exibidos
          são exemplos de demonstração.
        </p>
      </section>

      <footer className="find-footer">
        <Link className="brand" href="/">
          <BrandMark />
          <span>prumo</span>
        </Link>
        <span>Uma agenda mais leve para todo mundo.</span>
      </footer>
    </main>
  );
}
