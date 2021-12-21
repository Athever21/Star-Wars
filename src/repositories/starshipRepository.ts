import Starship, { IStarship } from "@/models/Starship";

export interface StarshipFilters {
  name?: string;
  model?: string;
  manufacturer?: string;
  cost_in_credits?: string;
  length?: string;
  max_atmosphering_speed?: string;
  crew?: string;
  passengers?: string;
  cargo_capacity?: string;
  consumables?: string;
  hyperdrive_rating?: string;
  MGLT?: string;
  starship_class?: string;
  pilots?: string | string[];
  films?: string | string[];
  page?: number,
  perPage?: number,
}

export const getAllStarship = async (
  filters: StarshipFilters
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

  const starships = await Starship.find(filters || {})
    .skip(page * perPage)
    .limit(perPage);

  return starships;
};

export const getStarshipById = async (id: number) => {
  const starship = await Starship.findById(id);
  return starship;
};

export const getStarshipByName = async (name: string) => {
  const starship = await Starship.findOne({ name });
  return starship;
};

export const createStarship = async (starship: StarshipFilters) => {
  const s = new Starship(starship);
  return s.save();
};

export const updateStarship = async (
  starship: IStarship,
  newStarship: StarshipFilters
) => {
  for (const [key, value] of Object.entries(newStarship)) {
    // @ts-ignore ???
    starship[key] = value;
  }

  await starship.save();
};
