import { Schema, model, Document } from "mongoose";

export interface IPlanet extends Document {
  name?: string;
  rotation_period?: string;
  orbital_period?: string;
  diameter?: string;
  climate?: string;
  gravity?: string;
  terrain?: string;
  surface_water?: string;
  population?: string;
  residents?: string[];
  films?: string[];
}

const planetSchema = new Schema({
  _id: Number,
  name: String,
  rotation_period: String,
  orbital_period: String,
  diameter: String,
  climate: String,
  gravity: String,
  terrain: String,
  surface_water: String,
  population: String,
  films: {
    type: [String],
    ref: "Film"
  },
  residents: {
    type: [String],
    ref: "People"
  },
});

export default model("Planet", planetSchema);