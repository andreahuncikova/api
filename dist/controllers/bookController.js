"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBook = createBook;
exports.getBooks = getBooks;
exports.getBookById = getBookById;
exports.updateBookById = updateBookById;
exports.deleteBookById = deleteBookById;
const bookModel_1 = require("../models/bookModel");
const database_1 = require("../repository/database");
// crud operations for books
/**
 * Create a new book
 * @param req - Express request object
 * @param res - Express response object
 */
function createBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        try {
            yield (0, database_1.connect)();
            const book = new bookModel_1.BookModel(data);
            const result = yield book.save();
            res.status(201).json(result);
        }
        catch (error) {
            res.status(500).json({ message: "Error creating book", error });
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Retrieve all books
 * @param req - Express request object
 * @param res - Express response object
 */
function getBooks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_1.connect)();
            const result = yield bookModel_1.BookModel.find({});
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ message: "Error retrieving books", error });
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Retrieve a book by ID
 * @param req - Express request object
 * @param res - Express response object
 */
function getBookById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_1.connect)();
            const bookId = req.params.id;
            const result = yield bookModel_1.BookModel.find({ _id: bookId });
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ message: "Error retrieving book", error });
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Update a book by ID
 * @param req - Express request object
 * @param res - Express response object
 */
function updateBookById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const bookId = req.params.id;
        try {
            yield (0, database_1.connect)();
            const result = yield bookModel_1.BookModel.findByIdAndUpdate(bookId, req.body, { new: true });
            if (!result) {
                res.status(404).json({ message: "Book not found" });
                return;
            }
            else {
                res.status(200).json({ message: "Book updated successfully", book: result });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Error updating book", error });
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
/**
 * Delete a book by ID
 * @param req - Express request object
 * @param res - Express response object
 */
function deleteBookById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const bookId = req.params.id;
        try {
            yield (0, database_1.connect)();
            const result = yield bookModel_1.BookModel.findByIdAndDelete(bookId);
            if (!result) {
                res.status(404).json({ message: "Book not found" });
                return;
            }
            else {
                res.status(200).json({ message: "Book deleted successfully", book: result });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Error deleting book", error });
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
//# sourceMappingURL=bookController.js.map