import { Contact } from "../services/shop.service";

export interface Shop { 
    _id?: string; 
    name: string; 
    box?: string | null; 
    rent: number; 
    contact?: Contact | null; 
    images?: string[]; 
    description?: string 
}