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
dotenv_flow_1.default.config();
//create express application
const app = (0, express_1.default)();
app.use('/api', routes_1.default);
function startServer() {
    (0, database_1.testConnection)();
    const PORT = parseInt(process.env.PORT) || 4000;
    app.listen(PORT, function () {
        console.log("Server is running on port: " + PORT);
    });
}
//# sourceMappingURL=app.js.map