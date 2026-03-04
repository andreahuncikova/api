import express, { Application, Request, Response } from 'express';
import dotenvFlow from "dotenv-flow";
import { testConnection } from './repository/database';
import routes from './routes';
import { setupDocumentation } from './util/documentation';
import cors from 'cors';


dotenvFlow.config();

//create express application
const app: Application = express();



//setup CORS middleware
function setupCors() {
    app.use(cors({
        // Allow all origins for development purposes
        origin: '*',

        // Allow specific HTTP methods
        methods: ['GET', 'POST', 'PUT', 'DELETE'],

        // Allow specific headers
        allowedHeaders: ['auth-token', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept'],

        // allow credentials if needed
        credentials: true,
    }));
} 


export function startServer() {

    //setup CORS
    setupCors();
    
    //json body parser
    app.use(express.json());

    // --- ROOT ROUTE ---
    app.get('/', (req: Request, res: Response) => {
        res.json({ status: 'ok', message: 'API is running!' });
    });

    //bind routes to application
    app.use('/api', routes);

    //setup documentation
    setupDocumentation(app);

    // test database connection
    testConnection();

    //start server
    const PORT: number = parseInt(process.env.PORT as string) || 4000;
    app.listen(PORT, function () {
        console.log("Server is running on port: " + PORT);
    });
}