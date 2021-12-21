import CustomError from "@/errors/CustomError";
import { notFound } from "@/errors/errorsMessages";
import getApiData from "@/helpers/getApiData";
import {
  getAllStarship,
  getStarshipById,
} from "@/repositories/starshipRepository";
import { NextFunction, Request, Response } from "express";

export const getStarshipsService = async (req: Request, res: Response) => {
  const films = await getAllStarship(req.query);

  return res.json(films);
};

export const getStarshipService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const idNum = Number(id);

  if (!idNum) return next(new CustomError(notFound, 404));

  const starship = await getStarshipById(idNum);

  if (!starship) {
    try {
      const data = await getApiData(
        `https://swapi.py4e.com/api/starships/${id}/?format=json`
      );
      return res.json(data);
    } catch {
      return next(new CustomError(notFound, 404));
    }
  }

  return res.json(starship);
};
