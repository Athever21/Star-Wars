import People, { IPeople } from "@/models/People";

export interface PeopleFilters {
  name?: string;
  height?: string;
  mass?: string;
  hair_color?: string;
  skin_color?: string;
  eye_color?: string;
  birth_year?: string;
  gender?: string;
  homeworld?: string;
  films?: string | string[];
  species?: string | string[];
  vehicles?: string | string[];
  starships?: string | string[];
  page?: string;
  perPage?: string;
}

export const getAllPeopleWoFilters = async() => {
  const people = await People.find();

  return people;
}

export const getAllPeople = async (filters: PeopleFilters) => {
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

  const people = await People.find(filters || {})
    .skip(page * perPage)
    .limit(perPage);

  return people;
};

export const getPeopleById = async (id: number) => {
  const people = await People.findById(id);
  return people;
};

export const getPeopleByName = async (name: string) => {
  const people = await People.findOne({ name });
  return people;
};

export const createPeople = async (people: PeopleFilters) => {
  const s = new People(people);
  return s.save();
};

export const updatePeople = async (
  people: IPeople,
  newPeople: PeopleFilters
) => {
  for (const [key, value] of Object.entries(newPeople)) {
    // @ts-ignore ???
    people[key] = value;
  }

  await people.save();
};
