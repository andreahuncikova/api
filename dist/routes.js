"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookController_1 = require("./controllers/bookController");
const authController_1 = require("./controllers/authController");
const authController_2 = require("./controllers/authController");
const devToolsController_1 = require("./controllers/devToolsController");
const router = (0, express_1.Router)();
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
router.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the TypeScript MEN REST-API' });
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
router.post('/auth/register', authController_1.registerUser);
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
router.post('/auth/login', authController_2.loginUser);
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
router.post('/books', authController_1.verifyToken, bookController_1.createBook);
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
router.get('/books', bookController_1.getBooks);
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
router.get('/books/:id', bookController_1.getBookById);
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
router.put('/books/:id', authController_1.verifyToken, bookController_1.updateBookById);
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
router.delete('/books/:id', authController_1.verifyToken, bookController_1.deleteBookById);
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
router.get('/start-cron/:duration', devToolsController_1.startCron);
exports.default = router;
//# sourceMappingURL=routes.js.map