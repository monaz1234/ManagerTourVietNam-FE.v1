import { Account } from "./account.interface";
import { Tour } from "./tour.interface";

export interface Book {
  idbook:string;
  account: Account | null;
  tour: Tour | null;
  status: boolean;
}
