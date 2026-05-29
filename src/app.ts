import express, { Application } from 'express';
import dotenvFlow from "dotenv-flow";
import { connect } from './repository/database';
import routes from './routes';
import { setupDocumentation } from './util/documentation';
import cors from 'cors';


dotenvFlow.config();

//create express application
const app: Application = express();



//setup CORS middleware
function setupCors() {
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['auth-token', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
    }));
} 


export async function startServer() {

    //setup CORS
    setupCors();
    
    //json body parser
    app.use(express.json());

    //bind routes to application
    app.use('/api', routes);

    //setup documentation
    setupDocumentation(app);

    // test database connection
    await connect();


    //start server
    const PORT: number = parseInt(process.env.PORT as string) || 4000;
    app.listen(PORT, function () {
        console.log("Server is running on port: " + PORT);
    });
}