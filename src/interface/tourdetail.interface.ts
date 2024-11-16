export interface TourDetail {
  idtour: string;
  depart: string;
  total_price: number;
  place: number;
  tour: {
    tourname: string;
    location: string;
    description: string;
    image: string;
  };
  }