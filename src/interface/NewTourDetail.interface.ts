import { Hotel } from './hotel.interface';
import { Service } from './service.interface';
import { Tour } from "./tour.interface";
import { Vehicle } from "./vehicle.interface";

// tourdetail.interface.ts
export interface NewTourDetail {


  idtour: string;
  depart: string;
  total_price: number;
  place: number;
  is_deleted: boolean;
  tour: Tour | null;
  vehicles: Vehicle | null;
  hotel: Hotel | null;
  service: Service | null;
}
