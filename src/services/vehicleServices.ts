import CustomError from "@/errors/CustomError";
import { notFound } from "@/errors/errorsMessages";
import getApiData from "@/helpers/getApiData";
import { getAllVehicle, getVehicleById } from "@/repositories/vehicleRepository";
import {NextFunction, Request, Response} from "express";

export const getVehiclesServices = async(req: Request, res: Response) => {
  const films = await getAllVehicle(req.query);

  return res.json(films);
}

export const getVehicleServices = async(req: Request, res: Response, next: NextFunction) => {
  let { id } = req.params;

  const idNum = Number(id);

  if (!idNum) return next(new CustomError(notFound, 404))

  const vehicle = await getVehicleById(idNum);

  if (!vehicle) {
    try {
      const data = await getApiData(`https://swapi.py4e.com/api/vehicles/${id}/?format=json`);
      return res.json(data);
    } catch {
      return next(new CustomError(notFound, 404))
    }
  }

  return res.json(vehicle);
}