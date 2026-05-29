import { Schema, model } from "mongoose";
import { Book } from "../interfaces/book";

const bookSchema = new Schema<Book>({
    title: { type: String, required: true, minlength: 1, maxlength: 255 },
    author: { type: String, required: true, minlength: 1, maxlength: 255 },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    genre: { type: String, required: false, max: 100 },
    publishedYear: { type: Number, required: false },
    pages: { type: Number, required: false },
    summary: { type: String, required: false, max: 1024 },
    available: { type: Boolean, required: true, default: true },
    _createdBy: { type: String, ref: "User", required: false },
    hasDiscount: { type: Boolean, required: false, default: false },
    discount: { type: Number, required: false, default: 0 },
    hidden: { type: Boolean, required: false, default: false },
}, { timestamps: true });

export const BookModel = model<Book>("Book", bookSchema);
