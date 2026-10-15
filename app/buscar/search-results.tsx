import {
  businessCategories,
  type Business,
  type BusinessCategory,
} from "../establishments";
import type { SortOrder } from "./search-utils";
import BusinessCard from "./business-card";
import { SearchIcon } from "./search-icons";

type SearchResultsProps = {
  results: readonly Business[];
  businesses: readonly Business[];
  category: BusinessCategory;
  sortOrder: SortOrder;
  searchTerm: string;
  location: string;
  hasFilters: boolean;
  directoryError: string;
  isLoadingDirectory: boolean;
  onCategoryChange: (category: BusinessCategory) => void;
  onSortChange: (sortOrder: SortOrder) => void;
  onClearFilters: () => void;
};

export default function SearchResults({
  results,
  businesses,
  category,
  sortOrder,
  searchTerm,
  location,
  hasFilters,
  directoryError,
  isLoadingDirectory,
  onCategoryChange,
  onSortChange,
  onClearFilters,
}: SearchResultsProps) {
  return (
    <section
      className="find-results find-content-width"
      aria-labelledby="results-title"
    >
      <div className="find-results-top">
        <div>
          <span className="find-section-label">LUGARES PARA VOCÊ</span>
          <h2 id="results-title">
            {hasFilters
              ? "Resultados da busca"
              : "Descubra lugares perto de você"}
          </h2>
        </div>
        <label className="find-sort">
          <span>Ordenar por</span>
          <select
            onChange={(event) =>
              onSortChange(event.target.value as SortOrder)
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
            onClick={() => onCategoryChange(item)}
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
          <button
            className="find-clear"
            onClick={onClearFilters}
            type="button"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="find-count" aria-live="polite">
        <strong>
          {results.length}{" "}
          {results.length === 1 ? "estabelecimento" : "estabelecimentos"}
        </strong>
        <span>
          {location.trim()
            ? `para "${location.trim()}"`
            : "com agendamento pelo Prumo"}
        </span>
      </div>

      {isLoadingDirectory ? (
        <div className="find-empty" role="status">
          <h3>Carregando estabelecimentos...</h3>
        </div>
      ) : directoryError ? (
        <div className="find-empty" role="alert">
          <h3>Não foi possível carregar os estabelecimentos</h3>
          <p>{directoryError}</p>
        </div>
      ) : results.length > 0 ? (
        <div className="find-list" aria-live="polite">
          {results.map((business) => (
            <BusinessCard
              business={business}
              key={business.establishmentId ?? business.initials}
            />
          ))}
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
          <button
            className="find-empty-button"
            onClick={onClearFilters}
            type="button"
          >
            Limpar busca
          </button>
        </div>
      )}

      <p className="find-demo-note">
        <span aria-hidden="true">✳</span>
        Você pode pesquisar sem criar uma conta. Os estabelecimentos são
        carregados do catálogo do Prumo.
      </p>
    </section>
  );
}
