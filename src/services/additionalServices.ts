import { Request, Response, NextFunction } from "express";
import { IFilm } from "@/models/Film";
import { getAllFilms } from "@/repositories/filmRepository";
import { getAllPeopleWoFilters } from "@/repositories/peopleRepository";
import { IPeople } from "@/models/People";

interface FilmsRequest extends Request {
  films?: IFilm[];
  opArray?: string[][];
}

export const getAllFilmsMiddleware = async (
  req: FilmsRequest,
  _: Response,
  next: NextFunction
) => {
  const films = await getAllFilms({}) as IFilm[];
  req.films = films;

  const arr: Array<Array<string>> = [];

  for (const film of films) {
    const op = film.opening_crawl
      ?.trim()
      .replace(/(\r\n|\n|\r|\.)/gm, " ")
      .split(" ")
      .filter((x: string) => !!x)

    arr.push(op!);
  }
  
  req.opArray = arr;
  return next();  
};

export const uniqueWordsService = async (req: FilmsRequest, res: Response) => {
  const wordsMap = new Map();

  for (let op of req.opArray!) {
    op = op.map((x: string) => x.toLowerCase());
    for (const word of op!) {
      const fromMap = wordsMap.get(word);

      wordsMap.set(word, fromMap ? fromMap + 1 : 1);
    }
  }

  return res.json(Object.fromEntries(wordsMap));
};

export const charactersService = async (req: FilmsRequest, res: Response) => {
  const people = await getAllPeopleWoFilters() as IPeople[];
  const peopleArr = people.map((x) => [x.name?.split(" ").length, x._id, x.name]);
  const peopleMap = new Map();
  
  for (let op of req.opArray!) {
    op = op.filter((x: string) => x[0] === x[0].toUpperCase()).map((x) => x.replace("'s", ""));
    for (let i = 0; i < op.length; i++) {
      for (const person of peopleArr) {
        const joinedWords = op.slice(i, i + person[0]).join(" ");
        if (joinedWords === person[2]) {
          const fromMap = peopleMap.get(person[2]);
          peopleMap.set(person[2], fromMap ? fromMap + 1 : 1);
          i += person[0];
          break;
        }
      }
    }
  }

  let max = 0;
  let maxArray: Array<string> = [];

  for (const [key, value] of peopleMap.entries()) {
    if (value > max) {
      max = value;
      maxArray = [key];
    }
    else if (value == max) maxArray.push(key);
  }

  return res.json({most_apperances: maxArray.length > 1 ? maxArray : maxArray[0]});
};
