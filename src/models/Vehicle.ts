import { Schema, model, Document } from "mongoose";

export interface IVehicle extends Document {
  name?: string;
  model?: string;
  manufacturer?: string;
  cost_in_credits?: string;
  length?: string;
  max_atmosphering_speed?: string;
  crew?: string;
  passengers?: string;
  cargo_capacity?: string;
  consumables?: string;
  vehicle_class?: string;
  pilots?: string[];
  films?: string[];
}

const vehicleSchema = new Schema({
  _id: Number,
  name: String,
  model: String,
  manufacturer: String,
  cost_in_credits: String,
  length: String,
  max_atmosphering_speed: String,
  crew: String,
  passengers: String,
  cargo_capacity: String,
  consumables: String,
  vehicle_class: String,
  pilots: {
    type: [String],
    ref: "People"
  },
  films: {
    type: [String],
    ref: "Film"
  },
});

export default model("Vehicle", vehicleSchema);