import Specie, { ISpecie } from "@/models/Specie";

export interface SpecieFilters {
  name?: string;
  classification?: string;
  designation?: string;
  average_height?: string;
  skin_colors?: string;
  hair_colors?: string;
  eye_colors?: string;
  average_lifespan?: string;
  homeworld?: string;
  language?: string;
  people?: string | string[];
  films?: string | string[];
  page?: number,
  perPage?: number,
}

export const getAllSpecies = async (
  filters: SpecieFilters
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

  const specie = await Specie.find(filters || {})
    .skip(page * perPage)
    .limit(perPage);

  return specie;
};

export const getSpecieById = async (id: number) => {
  const specie = await Specie.findById(id);
  return specie;
};

export const getSpecieByName = async (name: string) => {
  const specie = await Specie.findOne({ name });
  return specie;
};

export const createSpecie = async (specie: SpecieFilters) => {
  const s = new Specie(specie);
  return s.save();
};

export const updateSpecie = async (
  specie: ISpecie,
  newSpecie: SpecieFilters
) => {
  for (const [key, value] of Object.entries(newSpecie)) {
    // @ts-ignore ???
    specie[key] = value;
  }

  await specie.save();
};
