import { TypeUser } from './typeuser.interface';  // Đảm bảo đường dẫn đúng

import {User} from './user.interface'
export interface Account {
  idaccount: string;
  username: string;
  password: string;
  status: number;
  image: string;
  typeUser:TypeUser | null;
  user: User | null;
  [key: string]: any; // Thêm chỉ số kiểu string
}

