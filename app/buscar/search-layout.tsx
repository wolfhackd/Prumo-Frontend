import Link from "next/link";
import type { FormEvent } from "react";
import { BrandMark, PinIcon, SearchIcon } from "./search-icons";

type SearchHeroProps = {
  searchTerm: string;
  location: string;
  onSearchTermChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function SearchHeader() {
  return (
    <header className="find-header">
      <Link className="brand" href="/" aria-label="Prumo — início">
        <BrandMark />
        <span>prumo</span>
      </Link>
      <Link className="find-back-link" href="/">
        Voltar ao início
      </Link>
    </header>
  );
}

export function SearchHero({
  searchTerm,
  location,
  onSearchTermChange,
  onLocationChange,
  onSubmit,
}: SearchHeroProps) {
  return (
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

        <form className="find-form" role="search" onSubmit={onSubmit}>
          <label className="find-field">
            <SearchIcon />
            <span className="visually-hidden">
              Serviço ou estabelecimento
            </span>
            <input
              autoComplete="off"
              onChange={(event) => onSearchTermChange(event.target.value)}
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
              onChange={(event) => onLocationChange(event.target.value)}
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
  );
}

export function SearchFooter() {
  return (
    <footer className="find-footer">
      <Link className="brand" href="/">
        <BrandMark />
        <span>prumo</span>
      </Link>
      <span>Uma agenda mais leve para todo mundo.</span>
    </footer>
  );
}
