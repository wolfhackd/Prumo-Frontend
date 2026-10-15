export const businesses = [
  {
    establishmentId: "casa-amora",
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
    services: [
      { name: "Escova", price: "R$ 65", duration: "45 min" },
      { name: "Corte feminino", price: "R$ 90", duration: "1 h" },
      { name: "Coloração", price: "R$ 220", duration: "2 h 30" },
      { name: "Hidratação capilar", price: "R$ 110", duration: "1 h" },
    ],
    tone: "peach",
  },
  {
    establishmentId: "barbearia-aurora",
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
    services: [
      { name: "Corte masculino", price: "R$ 55", duration: "45 min" },
      { name: "Barba completa", price: "R$ 45", duration: "30 min" },
      { name: "Corte + barba", price: "R$ 85", duration: "1 h" },
      { name: "Acabamento", price: "R$ 30", duration: "20 min" },
    ],
    tone: "sage",
  },
  {
    establishmentId: "lume-estetica",
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
    services: [
      { name: "Limpeza de pele", price: "R$ 120", duration: "1 h 15" },
      { name: "Design de sobrancelhas", price: "R$ 65", duration: "45 min" },
      { name: "Massagem relaxante", price: "R$ 160", duration: "1 h" },
      { name: "Peeling facial", price: "R$ 180", duration: "1 h 30" },
    ],
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

export type Business = {
  establishmentId?: string;
  website?: string | null;
  initials: string;
  name: string;
  category: string;
  categoryFilter?: Exclude<BusinessCategory, "Todos">;
  detail: string;
  neighborhood: string;
  rating: string;
  numericRating: number;
  service: string;
  price: string;
  duration: string;
  services: readonly { name: string; price: string; duration: string }[];
  tone: string;
};

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
  businessList: readonly Business[] = businesses,
) {
  const searchTerms = normalizeSearchText(searchTerm)
    .split(/\s+/)
    .filter(Boolean);
  const locationTerms = normalizeSearchText(location)
    .split(/\s+/)
    .filter(Boolean);

  return businessList.filter((business) => {
    const searchableDetails = normalizeSearchText(
      [
        business.name,
        business.category,
        business.categoryFilter,
        business.detail,
        business.service,
        ...business.services.map((service) => service.name),
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
