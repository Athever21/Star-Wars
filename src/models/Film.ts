import { Schema, model, Document } from "mongoose";

export interface IFilm extends Document {
  title?: string;
  episode_id?: string;
  opening_crawl?: string;
  director?: string;
  producer?: string;
  release_date?: string;
  characters?: string[];
  planets?: string[];
  starships?: string[];
  vehicles?: string[];
  species?: string[];
}

const filmSchema = new Schema({
  _id: Number,
  title: String,
  episode_id: String,
  opening_crawl: String,
  director: String,
  producer: String,
  release_date: String,
  characters: {
    type: [String],
    ref: "People"
  },
  planets: {
    type: [String],
    ref: "Planet"
  },
  starships: {
    type: [String],
    ref: "Starship"
  },
  vehicles: {
    type: [String],
    ref: "Vehicle"
  },
  species: {
    type: [String],
    ref: "Specie"
  }
});

export default model("Film", filmSchema);