import { Schema, model, Document } from "mongoose";

export interface IPeople extends Document {
  name?: string;
  height?: string;
  mass?: string;
  hair_color?: string;
  skin_color?: string;
  eye_color?: string;
  birth_year?: string;
  gender?: string;
  homeworld?: string;
  films?: string[];
  species?: string[];
  vehicles?: string[];
  starships?: string[];
}

const peopleSchema = new Schema({
  _id: Number,
  name: String,
  height: String,
  hair_color: String,
  skin_color: String,
  eye_color: String,
  birth_year: String,
  gender: String,
  homeworld: {
    type: String,
    ref: "Planet",
  },
  films: {
    type: [String],
    ref: "Film",
  },
  species: {
    type: [String],
    ref: "Specie",
  },
  vehicles: {
    type: [String],
    ref: "Vehicle",
  },
  starships: {
    type: [String],
    ref: "Starship",
  },
});

export default model("People", peopleSchema);
