"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  businessCategories,
  filterBusinesses,
  type BusinessCategory,
} from "./establishments";

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={diagonal ? "arrow-icon arrow-icon-diagonal" : "arrow-icon"}
      viewBox="0 0 20 20"
      fill="none"
    >
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

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path
        d="m5 10 3.2 3.2L15 6.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function EstablishmentSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<BusinessCategory>("Todos");

  const filteredBusinesses = useMemo(() => {
    return filterBusinesses(searchTerm, "", category);
  }, [category, searchTerm]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function clearFilters() {
    setSearchTerm("");
    setCategory("Todos");
  }

  const hasFilters = Boolean(searchTerm.trim()) || category !== "Todos";

  return (
    <div className="booking-mockup">
      <div className="booking-topbar">
        <a className="brand booking-brand" href="#inicio">
          <BrandMark />
          <span>prumo</span>
        </a>
        <span className="booking-location">
          ⌖ &nbsp; São Paulo, SP <span>⌄</span>
        </span>
        <span className="booking-menu">☰</span>
      </div>
      <div className="booking-content">
        <span className="booking-kicker">UM TEMPO SÓ SEU ✳</span>
        <h3>
          O que você está
          <br />a fim de fazer?
        </h3>
        <form
          className="search-box"
          role="search"
          onSubmit={handleSearch}
        >
          <span className="search-symbol" aria-hidden="true">
            ⌕
          </span>
          <input
            aria-label="Buscar por estabelecimento, serviço ou bairro"
            autoComplete="off"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Serviço, estabelecimento ou bairro..."
            type="search"
            value={searchTerm}
          />
          {searchTerm && (
            <button
              aria-label="Limpar busca"
              className="clear-search"
              onClick={() => setSearchTerm("")}
              type="button"
            >
              ×
            </button>
          )}
          <button
            aria-label="Buscar estabelecimentos"
            className="search-button"
            type="submit"
          >
            <ArrowIcon />
          </button>
        </form>
        <div aria-label="Filtrar por categoria" className="category-row">
          {businessCategories.map((item) => (
            <button
              aria-pressed={category === item}
              className={`category-chip${category === item ? " selected" : ""}`}
              key={item}
              onClick={() => setCategory(item)}
              type="button"
            >
              {item === "Todos" && <span aria-hidden="true">✳ &nbsp;</span>}
              {item}
            </button>
          ))}
        </div>
        <div className="results-heading">
          <strong>
            {hasFilters ? "Resultados da busca" : "Um bom lugar pra começar"}
          </strong>
          <span aria-live="polite">
            {filteredBusinesses.length}{" "}
            {filteredBusinesses.length === 1 ? "lugar" : "lugares"}
          </span>
        </div>
        {filteredBusinesses.length > 0 ? (
          <div aria-live="polite" className="business-list">
            {filteredBusinesses.map((business) => (
              <article className="business-card" key={business.initials}>
                <div
                  className={`business-illustration illustration-${business.tone}`}
                >
                  <span>{business.initials}</span>
                  <i aria-hidden="true">✳</i>
                </div>
                <div className="business-info">
                  <div className="business-name-row">
                    <h4>{business.name}</h4>
                    <span>★ {business.rating}</span>
                  </div>
                  <p>
                    {business.category} <span>·</span> {business.detail}
                  </p>
                  <div className="business-service-row">
                    <span>
                      {business.service} <i>·</i> {business.duration}
                    </span>
                    <strong>{business.price}</strong>
                  </div>
                </div>
                <span className="business-arrow">
                  <ArrowIcon diagonal />
                </span>
              </article>
            ))}
          </div>
        ) : (
          <div className="search-empty-state" role="status">
            <span aria-hidden="true">⌕</span>
            <strong>Nenhum lugar encontrado</strong>
            <p>
              Tente outro serviço, estabelecimento ou bairro, ou limpe os
              filtros.
            </p>
            <button onClick={clearFilters} type="button">
              Limpar filtros
            </button>
          </div>
        )}
        <div className="booking-note">
          <span className="booking-note-icon">
            <CheckIcon />
          </span>
          <span>
            <strong>Já marcou?</strong> Consulte seu horário com CPF ou e-mail,
            sem login.
          </span>
          <ArrowIcon />
        </div>
      </div>
    </div>
  );
}
