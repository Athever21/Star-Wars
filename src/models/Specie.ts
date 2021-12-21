import { Schema, model, Document } from "mongoose";

export interface ISpecie extends Document {
  name?: string;
  classification?: string;
  designation?: string;
  average_height?: string;
  skin_colors?: string;
  hair_colors?: string;
  eye_colors?: string;
  average_lifespan?: string;
  homeworld?: string;
  language?: string;
  people?: string | string[];
  films?: string | string[];
}

const specieSchema = new Schema({
  _id: Number,
  name: String,
  classification: String,
  designation: String,
  average_height: String,
  skin_colors: String,
  hair_colors: String,
  eye_colors: String,
  average_lifespan: String,
  homeworld: {
    type: String,
    ref: "Planet"
  },
  language: String,
  films: {
    type: [String],
    ref: "Film"
  },
  people: {
    type: [String],
    ref: "People"
  },
});

export default model("Specie", specieSchema);