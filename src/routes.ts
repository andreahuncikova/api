import { Router, Request, Response } from "express";
import { 
    createBook, 
    getBooks, 
    getBookById,
    updateBookById,
    deleteBookById
 } from "./controllers/bookController";
import { registerUser, verifyToken } from "./controllers/authController";
import { loginUser } from "./controllers/authController";
import { startCron } from "./controllers/devToolsController";

const router: Router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - App Routes
 *     summary: Check
 *     description: check if the server is up and running
 *     responses:
 *       200:
 *         description: Server up and running.
 */


router.get('/', (req: Request, res: Response) => {
    //connect to database 
    res.status(200).send('Welcome to this API');
    // disconnect from database
});



// AUTH
/**
* @swagger
* /auth/register:
*   post:
*     tags:
*       - User Routes
*     summary: Register a new user
*     description: Takes a user in the body and tries to register it in the database
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: "#/components/schemas/User"
*     responses:
*       201:
*         description: User created succesfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                 _id:
*                   type: string
*/
router.post('/auth/register', registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - User Routes
 *     summary: Login user
 *     description: Authenticates user and returns a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
router.post('/auth/login', loginUser);


// CRUD
/**
 * @swagger
 * /books:
 *   post:
 *     tags:
 *       - Book Routes
 *     summary: Create a new Book
 *     description: Creates a new book in the database
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Book"
 *     responses:
 *       201:
 *         description: Book created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/books', verifyToken, createBook);

/**
 * @swagger
 * /books:
 *   get:
 *     tags:
 *       - Book Routes
 *     summary: Get all books
 *     description: Returns all books from the database
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Book"
 */
router.get('/books', getBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     tags:
 *       - Book Routes
 *     summary: Get book by ID
 *     description: Returns a single book by its MongoDB ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Book"
 *       404:
 *         description: Book not found
 */
router.get('/books/:id', getBookById);

/**
* @swagger
* /books/{id}:
*   put:
*     tags:
*       - Book Routes
*     summary: Updates a specific Book
*     description: Updates a specific Book based on it id
*     security:
*       - ApiKeyAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: MongoDB id
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: "#/components/schemas/Book"
*
*     responses:
*       200:
*         description: Book updated succesfully
*         content:
*           application/json:
*             schema:
*               $ref: "#/components/schemas/Book"
*/
router.put('/books/:id', verifyToken, updateBookById);


/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     tags:
 *       - Book Routes
 *     summary: Delete a Book
 *     description: Deletes a book by ID
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */
router.delete('/books/:id', verifyToken, deleteBookById);

/**
 * @swagger
 * /start-cron/{duration}:
 *   get:
 *     tags:
 *       - Dev Tools
 *     summary: Start cron job to ping server
 *     description: Starts a cron job that pings the server to prevent it from sleeping (Render)
 *     parameters:
 *       - in: path
 *         name: duration
 *         required: true
 *         schema:
 *           type: integer
 *         description: Duration in minutes
 *     responses:
 *       200:
 *         description: Cron job started
 */
router.get('/start-cron/:duration', startCron);

export default router;