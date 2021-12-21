import CustomError from "@/errors/CustomError";
import { notFound } from "@/errors/errorsMessages";
import getApiData from "@/helpers/getApiData";
import { getAllPeople, getPeopleById } from "@/repositories/peopleRepository";
import {NextFunction, Request, Response} from "express";

export const getPeopleService = async(req: Request, res: Response) => {
  const films = await getAllPeople(req.query);

  return res.json(films);
}

export const getPeopleIdService = async(req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  const idNum = Number(id);

  if (!idNum) return next(new CustomError(notFound, 404));

  const person = await getPeopleById(idNum);

  if (!person) {
    try {
      const data = await getApiData(`https://swapi.py4e.com/api/people/${id}/?format=json`);
      return res.json(data);
    } catch {
      return next(new CustomError(notFound, 404))
    }
  }

  return res.json(person);
}