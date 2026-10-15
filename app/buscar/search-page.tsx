"use client";

import type { FormEvent } from "react";
import SearchResults from "./search-results";
import { SearchFooter, SearchHeader, SearchHero } from "./search-layout";
import { useSearchPage } from "./use-search-page";

export default function SearchPage() {
  const search = useSearchPage();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className="find-page">
      <SearchHeader />
      <SearchHero
        searchTerm={search.searchTerm}
        location={search.location}
        onSearchTermChange={search.setSearchTerm}
        onLocationChange={search.setLocation}
        onSubmit={handleSubmit}
      />
      <SearchResults
        results={search.results}
        businesses={search.searchBusinesses}
        category={search.category}
        sortOrder={search.sortOrder}
        searchTerm={search.searchTerm}
        location={search.location}
        hasFilters={search.hasFilters}
        directoryError={search.directoryError}
        isLoadingDirectory={search.isLoadingDirectory}
        onCategoryChange={search.setCategory}
        onSortChange={search.setSortOrder}
        onClearFilters={search.clearFilters}
      />
      <SearchFooter />
    </main>
  );
}
