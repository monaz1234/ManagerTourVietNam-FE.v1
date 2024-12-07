import { Account } from "./account.interface";
import { Payment_Medthod } from "./payment_method.interface";
import { Book } from "./book.interface";
export interface Invoice {
  id_invoice: string;
  idaccount: Account | null;
  payment_time : string;
  total_amount : number;
  status : number;
  idbook : Book | null;
  payment_name: string;
}
