import { House } from "./house.interface";
import { Vehicle } from "./vehicle.interface";
export interface PolicyRequest {
  age: number;
  dependents: number;
  house: House;
  income: number;
  marital_status: string;
  risk_questions: number[];
  vehicle: Vehicle;
}
