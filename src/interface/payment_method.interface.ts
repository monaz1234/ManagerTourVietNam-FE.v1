export interface Payment_Medthod{
  id_method : string;
  payment_code : string;
  payment_name: string;
  description : string;
  fee_precentage : number;
  supported_currencies: string;
  transaction_limit: number;
  is_active : boolean;
  created_at : Date;
  updated_at : Date;
  free_precentage : number;
}
