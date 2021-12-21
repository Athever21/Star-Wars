import { cacheResource } from "@/helpers/cachingFuncs";

import Film from "@/models/Film";
import People from "@/models/People";
import Planet from "@/models/Planet";
import Specie from "@/models/Specie";
import Starship from "@/models/Starship";
import Vehicle from "@/models/Vehicle";
import { createFilm } from "@/repositories/filmRepository";
import { createPeople } from "@/repositories/peopleRepository";
import { createPlanet } from "@/repositories/planetRepository";
import { createSpecie } from "@/repositories/specieRepository";
import { createStarship } from "@/repositories/starshipRepository";
import { createVehicle } from "@/repositories/vehicleRepository";

const cacheTable = [
  ["https://swapi.py4e.com/api/films/?format=json", Film, createFilm, "films"],
  [
    "https://swapi.py4e.com/api/people/?format=json",
    People,
    createPeople,
    "people",
  ],
  [
    "https://swapi.py4e.com/api/vehicles/?format=json",
    Vehicle,
    createVehicle,
    "vehicles",
  ],
  [
    "https://swapi.py4e.com/api/species/?format=json",
    Specie,
    createSpecie,
    "species",
  ],
  [
    "https://swapi.py4e.com/api/starships/?format=json",
    Starship,
    createStarship,
    "starships",
  ],
  [
    "https://swapi.py4e.com/api/planets/?format=json",
    Planet,
    createPlanet,
    "planets",
  ],
];

export default () => {
  if (process.env.NODE_ENV !== "test") {
    for (const resource of cacheTable) {
      cacheResource(resource);
    }

    setInterval(() => {
      for (const resource of cacheTable) {
        cacheResource(resource);
      }
    }, 1000 * 60 * 60 * 24);
  }
};
