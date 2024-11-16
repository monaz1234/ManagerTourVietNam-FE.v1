export interface User {
  iduser: string;
  name: string;
  birth: string;
  email: string;
  phone: string;
  points: number;
  salary: number;
  reward: string;
  status: string;
  typeUser: {
    idtypeuser: string;
    name_type: string;
    status: number;
    salary: number;
  };
}
