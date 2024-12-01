import { Account } from "./account.interface";
import { Payment_Medthod } from "./payment_method.interface";

export interface Invoice {
  id_invoice: string;
  idaccount: Account | null;
  payment_time : Date;
  total_amount : number;
  status : boolean;
  id_method : Payment_Medthod | null;
}
