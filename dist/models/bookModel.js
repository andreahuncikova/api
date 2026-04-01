"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookModel = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: true, min: 1, max: 255 },
    author: { type: String, required: true, min: 1, max: 255 },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    genre: { type: String, required: false, max: 100 },
    publishedYear: { type: Number, required: false },
    pages: { type: Number, required: false },
    summary: { type: String, required: false, max: 1024 },
    available: { type: Boolean, required: true, default: true },
    _createdBy: { type: String, ref: "User", required: true }
}, { timestamps: true });
exports.BookModel = (0, mongoose_1.model)("Book", bookSchema);
//# sourceMappingURL=bookModel.js.map