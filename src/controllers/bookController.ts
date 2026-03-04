import { Request, Response } from "express";
import { BookModel } from "../models/bookModel";
import { connect, disconnect } from "../repository/database";

// crud operations for books
/**
 * Create a new book
 * @param req - Express request object
 * @param res - Express response object
 */
export async function createBook(req: Request, res: Response): Promise<void> {
    const data = req.body;
    try {
        await connect();
        const book = new BookModel(data);
        const result = await book.save();
        res.status(201).json(result);
    }
    catch (error){
        res.status(500).json({ message: "Error creating book", error });
    }
    finally {
        await disconnect();
    }
}


/**
 * Retrieve all books
 * @param req - Express request object
 * @param res - Express response object
 */
export async function getBooks(req: Request, res: Response) {
    
    try {
        await connect();
        
        const result = await BookModel.find({});

        res.status(200).json(result);
    }
    catch (error){
        res.status(500).json({ message: "Error retrieving books", error });
    }
    finally {
        await disconnect();
    }
}

/**
 * Retrieve a book by ID
 * @param req - Express request object
 * @param res - Express response object
 */
export async function getBookById(req: Request, res: Response) {
    
    try {
        await connect();
        
        const bookId = req.params.id;
        const result = await BookModel.find({ _id: bookId });

        res.status(200).json(result);
    }
    catch (error){
        res.status(500).json({ message: "Error retrieving book", error });
    }
    finally {
        await disconnect();
    }
}


/**
 * Update a book by ID
 * @param req - Express request object
 * @param res - Express response object
 */
export async function updateBookById(req: Request, res: Response) {

    const bookId = req.params.id;
    
    try {
        await connect();
        
        const result = await BookModel.findByIdAndUpdate(bookId, req.body, { new: true });

        if (!result) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        else {
        res.status(200).json({ message: "Book updated successfully", book: result });
        }
    }
    catch (error){
        res.status(500).json({ message: "Error updating book", error });
    }
    finally {
        await disconnect();
    }
}


/**
 * Delete a book by ID
 * @param req - Express request object
 * @param res - Express response object
 */
export async function deleteBookById(req: Request, res: Response) {

    const bookId = req.params.id;
    
    try {
        await connect();
        
        const result = await BookModel.findByIdAndDelete(bookId);

        if (!result) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        else {
        res.status(200).json({ message: "Book deleted successfully", book: result });
        }
    }
    catch (error){
        res.status(500).json({ message: "Error deleting book", error });
    }
    finally {
        await disconnect();
    }
}