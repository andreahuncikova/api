"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
const express_1 = __importDefault(require("express"));
const dotenv_flow_1 = __importDefault(require("dotenv-flow"));
const database_1 = require("./repository/database");
const routes_1 = __importDefault(require("./routes"));
const documentation_1 = require("./util/documentation");
const cors_1 = __importDefault(require("cors"));
dotenv_flow_1.default.config();
//create express application
const app = (0, express_1.default)();
//setup CORS middleware
function setupCors() {
    app.use((0, cors_1.default)({
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
function startServer() {
    //setup CORS
    setupCors();
    //json body parser
    app.use(express_1.default.json());
    //bind routes to application
    app.use('/api', routes_1.default);
    //setup documentation
    (0, documentation_1.setupDocumentation)(app);
    // test database connection
    (0, database_1.testConnection)();
    //start server
    const PORT = parseInt(process.env.PORT) || 4000;
    app.listen(PORT, function () {
        console.log("Server is running on port: " + PORT);
    });
}
//# sourceMappingURL=app.js.map