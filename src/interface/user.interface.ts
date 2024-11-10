import { TypeUser } from './typeuser.interface';  // Đảm bảo đường dẫn đúng
export interface User {
  iduser: string;
  name: string;
  birth: string;
  email: string;
  phone: string;
  points: number;
  salary: number;
  reward: number;
  status: number;
  typeUser: TypeUser | null;

  [key: string]: any; // Thêm chỉ số kiểu string
}


