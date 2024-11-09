export interface Account {
  idaccount: string;
  username: string;
  password: string;
  status: number;
  image: string;
  typeUser: {
    idtypeuser: string;
    name_type: string;
    status: number;
    salary: number;
  };
  user: {
    iduser: string;
    name: string;
    birth: string;
    email: string;
    phone: string;
    points: number;
    salary: number;
    reward: number;
    status: number;
    typeUser: {
      idtypeuser: string;
      name_type: string;
      status: number;
      salary: number;
    };
  };
}

