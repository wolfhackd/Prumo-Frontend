export const businesses = [
  {
    initials: "CA",
    name: "Casa Amora",
    category: "Salão de beleza",
    categoryFilter: "Beleza",
    detail: "Jardins · São Paulo",
    neighborhood: "Jardins",
    rating: "4,9",
    numericRating: 4.9,
    service: "Escova",
    price: "R$ 65",
    duration: "45 min",
    tone: "peach",
  },
  {
    initials: "BA",
    name: "Barbearia Aurora",
    category: "Barbearia",
    categoryFilter: "Barbearia",
    detail: "Pinheiros · São Paulo",
    neighborhood: "Pinheiros",
    rating: "4,8",
    numericRating: 4.8,
    service: "Corte + barba",
    price: "R$ 85",
    duration: "1 h",
    tone: "sage",
  },
  {
    initials: "LE",
    name: "Lume Estética",
    category: "Estética",
    categoryFilter: "Bem-estar",
    detail: "Vila Madalena · São Paulo",
    neighborhood: "Vila Madalena",
    rating: "5,0",
    numericRating: 5,
    service: "Limpeza de pele",
    price: "R$ 120",
    duration: "1 h 15",
    tone: "lilac",
  },
] as const;

export const businessCategories = [
  "Todos",
  "Beleza",
  "Barbearia",
  "Bem-estar",
] as const;

export type BusinessCategory = (typeof businessCategories)[number];

export function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function filterBusinesses(
  searchTerm: string,
  location: string,
  category: BusinessCategory,
) {
  const searchTerms = normalizeSearchText(searchTerm)
    .split(/\s+/)
    .filter(Boolean);
  const locationTerms = normalizeSearchText(location)
    .split(/\s+/)
    .filter(Boolean);

  return businesses.filter((business) => {
    const searchableDetails = normalizeSearchText(
      [
        business.name,
        business.category,
        business.categoryFilter,
        business.detail,
        business.service,
      ].join(" "),
    );
    const searchableLocation = normalizeSearchText(business.detail);
    const matchesCategory =
      category === "Todos" || business.categoryFilter === category;

    return (
      matchesCategory &&
      searchTerms.every((term) => searchableDetails.includes(term)) &&
      locationTerms.every((term) => searchableLocation.includes(term))
    );
  });
}
