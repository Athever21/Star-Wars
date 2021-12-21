import Vehicle, { IVehicle } from "@/models/Vehicle";

export interface VehicleFilters {
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
  pilots?: string | string[];
  films?: string | string[];
  page?: number;
  perPage?: number;
}

export const getAllVehicle = async (filters: VehicleFilters) => {
  let page = Number(filters.page) ? Number(filters.page) : 0;
  let perPage = Number(filters.perPage) ? Number(filters.perPage) : 25;

  if (perPage < 1 || perPage > 100) perPage = 25;
  if (page < 0 || page > 1000) page = 0;

  delete filters.perPage;
  delete filters.page;

  for (const [key, value] of Object.entries(filters)) {
    // @ts-ignore
    filters[key] = { $regex: value };
  }

  const vehicle = await Vehicle.find(filters || {})
    .skip(page * perPage)
    .limit(perPage);

  return vehicle;
};

export const getVehicleById = async (id: number) => {
  const vehicle = await Vehicle.findById(id);
  return vehicle;
};

export const getVehicleByName = async (name: string) => {
  const vehicle = await Vehicle.findOne({ name });
  return vehicle;
};

export const createVehicle = async (vehicle: VehicleFilters) => {
  const s = new Vehicle(vehicle);
  return s.save();
};

export const updateVehicle = async (
  vehicle: IVehicle,
  newVehicle: VehicleFilters
) => {
  for (const [key, value] of Object.entries(newVehicle)) {
    // @ts-ignore ???
    vehicle[key] = value;
  }

  await vehicle.save();
};
