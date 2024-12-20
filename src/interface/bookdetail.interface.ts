import { Book } from "./book.interface";
import { Promotion } from "./promotion.interface";

export interface bookdetail{
  idbookdetail : String,
  idbook : Book | null,
  promotion_code : Promotion | null,
  time_book: String,
  quantity : number,
  participant: String,
}
