import { Request, Response } from "express";
import { BookModel } from "../models/bookModel";

export async function createBook(req: Request, res: Response): Promise<void> {
    try {
        const book = new BookModel(req.body);
        const result = await book.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error creating book", error });
    }
}

export async function getBooks(req: Request, res: Response) {
    try {
        const result = await BookModel.find({});
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books", error });
    }
}

export async function getBookById(req: Request, res: Response) {
    try {
        const result = await BookModel.find({ _id: req.params.id });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving book", error });
    }
}

export async function updateBookById(req: Request, res: Response) {
    try {
        const result = await BookModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!result) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        res.status(200).json({ message: "Book updated successfully", book: result });
    } catch (error) {
        res.status(500).json({ message: "Error updating book", error });
    }
}

export async function deleteBookById(req: Request, res: Response) {
    try {
        const result = await BookModel.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        res.status(200).json({ message: "Book deleted successfully", book: result });
    } catch (error) {
        res.status(500).json({ message: "Error deleting book", error });
    }
}
