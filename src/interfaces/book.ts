import { User } from "./user";

export interface Book {
    title: string;
    author: string;
    image: string;  
    price: number;
    genre?: string;
    publishedYear?: number;
    pages?: number;
    summary?: string;
    available?: boolean;
    _createdBy: User['id'];
}
