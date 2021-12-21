import Film, { IFilm } from "@/models/Film";

export interface FilmFilters {
  title?: string;
  episode_id?: string;
  opening_crawl?: string;
  director?: string;
  producer?: string;
  release_date?: string;
  characters?: string | string[];
  planets?: string | string[];
  starships?: string | string[];
  vehicles?: string | string[];
  species?: string | string[];
  page?: string;
  perPage?: string;
}

export const getAllFilms = async (filters: FilmFilters) => {
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

  const films = await Film.find(filters || {})
    .skip(page * perPage)
    .limit(perPage);

  return films;
};

export const getFilmById = async (id: number) => {
  const film = await Film.findById(id);
  return film;
};

export const getFilmByName = async (name: string) => {
  const film = await Film.findOne({ name });
  return film;
};

export const createFilm = async (film: FilmFilters) => {
  const s = new Film(film);
  return s.save();
};

export const updateFilm = async (film: IFilm, newFilm: FilmFilters) => {
  for (const [key, value] of Object.entries(newFilm)) {
    // @ts-ignore ???
    film[key] = value;
  }

  await film.save();
};
