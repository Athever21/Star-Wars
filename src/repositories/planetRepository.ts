import Planet, { IPlanet } from "@/models/Planet";

export interface PlanetFilters {
  name?: string;
  rotation_period?: string;
  orbital_period?: string;
  diameter?: string;
  climate?: string;
  gravity?: string;
  terrain?: string;
  surface_water?: string;
  population?: string;
  residents?: string | string[];
  films?: string | string[];
  page?: number,
  perPage?: number,
}

export const getAllPlanets = async (
  filters: PlanetFilters
) => {
  let page = Number(filters.page) ? Number(filters.page) : 0;
  let perPage = Number(filters.perPage) ? Number(filters.perPage) : 25;

  if (perPage < 1 || perPage > 100) perPage = 25;
  if (page < 0 || page > 1000) page = 0;

  delete filters.perPage;
  delete filters.page;

  for (const [key, value] of Object.entries(filters)) {
    // @ts-ignore
    filters[key] = { $regex: value };
  }

  const planet = await Planet.find(filters || {})
    .skip(page * perPage)
    .limit(perPage);

  return planet;
};

export const getPlanetById = async (id: number) => {
  const planet = await Planet.findById(id);
  return planet;
};

export const getPlanetByName = async (name: string) => {
  const planet = await Planet.findOne({ name });
  return planet;
};

export const createPlanet = async (planet: PlanetFilters) => {
  const s = new Planet(planet);
  return s.save();
};

export const updatePlanet = async (
  planet: IPlanet,
  newPlanet: PlanetFilters
) => {
  for (const [key, value] of Object.entries(newPlanet)) {
    // @ts-ignore ???
    planet[key] = value;
  }

  await planet.save();
};
