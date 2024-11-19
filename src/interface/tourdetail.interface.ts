// tourdetail.interface.ts
export interface TourDetail {
  idtour: string;
  depart: string;
  total_price: number;
  place: number;
  is_deleted: boolean;
  tour: {
    idtour: string;
    idtour_type: string;
    tourname: string;
    location: string;
    status: boolean;
    description: string;
    image: string;
    is_deleted: boolean;
  };
  vehicles: {
    id_vehicles: string;
    name_vehicles: string;
    place_vehicles: number;
    driver: string;
    image: string;
    description: string;
    status: boolean;
    price: number;
  };
  hotel: {
    id_hotel: string;
    name_hotel: string;
    description: string;
    image: string;
    status: boolean;
    price: number;
  };
  service: {
    id_service: string;
    name_service: string;
    description: string;
    time_start: string;
    time_end: string;
    plant: string;
    status: boolean;
    price: number;
  };
}
