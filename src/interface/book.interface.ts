import { Account } from "./account.interface";
import { Tour } from "./tour.interface";

export interface Book {
    idbook:string;
    idaccount: Account | null;
    idtour: Tour | null;
    status: boolean;
  }
