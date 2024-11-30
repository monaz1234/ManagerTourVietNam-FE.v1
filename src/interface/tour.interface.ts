import { TypeTour } from "./typeTour.interface";

export interface Tour {
    idtour:string;
    idtour_type:string;
    tourname:string;
    location:string;
    status: boolean;
    description: string;
    image: string;
    is_deleted: boolean;

    // idtour:string;
    // idtour_type: TypeTour | null,
    // tourname:string;
    // location:string;
    // status: boolean;
    // description: string;
    // image: string;
    // is_deleted: boolean;
  }
