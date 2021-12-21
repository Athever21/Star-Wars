import CustomError from "@/errors/CustomError";
import { notFound } from "@/errors/errorsMessages";
import getApiData from "@/helpers/getApiData";
import { IFilm } from "@/models/Film";
import { getAllFilms, getFilmById } from "@/repositories/filmRepository";
import { NextFunction, Request, Response } from "express";

interface FilmRequest extends Request {
  film?: IFilm
}

export const getFilmsServices = async (req: Request, res: Response) => {
  const films = await getAllFilms(req.query);

  return res.json(films);
};

export const getIdFilmMiddleware = async (
  req: FilmRequest,
  _: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const idNum = Number(id);

  if (!idNum) return next(new CustomError(notFound, 404));

  const film = await getFilmById(idNum);

  if (!film) {
    try {
      const data = await getApiData(
        `https://swapi.py4e.com/api/films/${id}/?format=json`
      ) as any;
      req.film = data;
      return next();
    } catch {
      return next(new CustomError(notFound, 404));
    }
  }

  req.film = film as any;
  return next();
}

export const getFilmService = async (
  req: FilmRequest,
  res: Response
) => {
  return res.json(req.film);
};
