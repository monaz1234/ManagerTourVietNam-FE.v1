import { Book } from "./book.interface";
import { Payment_Medthod } from "./payment_method.interface";
import { Tour } from "./tour.interface";

export interface InvoiceDetail {
  id_invoice_detail : string;
  quantity : number;
  total_amount : number;
  unit_price : number;
  idbook : Book | null;
  id_invoice : Payment_Medthod | null;
  idtour : Tour | null;
}
