import CustomError from "@/errors/CustomError";
import { notFound } from "@/errors/errorsMessages";
import getApiData from "@/helpers/getApiData";
import { getAllSpecies, getSpecieById } from "@/repositories/specieRepository";
import {NextFunction, Request, Response} from "express";

export const getSpeciesService = async(req: Request, res: Response) => {
  const films = await getAllSpecies(req.query);

  return res.json(films);
}

export const getSpecieService = async(req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const idNum = Number(id);

  if (!idNum) return next(new CustomError(notFound, 404));

  const specie = await getSpecieById(idNum);

  if (!specie) {
    try {
      const data = await getApiData(`https://swapi.py4e.com/api/species/${id}/?format=json`);
      return res.json(data);
    } catch {
      return next(new CustomError(notFound, 404))
    }
  }

  return res.json(specie);
}