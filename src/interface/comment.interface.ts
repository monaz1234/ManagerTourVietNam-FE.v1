export interface Comment {
    idcomment:string;
    content: string;
    created_at: string;
    iduser: string;
    idtour: string;
    id_hotel: string;
    account?: { 
        iduser: string
        username: string 
      }; // Chứa thông tin account, bao gồm username
  }