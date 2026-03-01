export interface UserDTO { 
    _id?: string; 
    name: string; 
    email: string; 
    password?: string; 
    role: string; 
    shopId?: string | null; 
    isActive: boolean 
}