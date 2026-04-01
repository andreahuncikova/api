"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, min: 6, max: 255 },
    email: { type: String, required: true, min: 6, max: 255, unique: true },
    password: { type: String, required: true, min: 6, max: 255 },
    registerDate: { type: Date, default: Date.now, required: true }
});
exports.userModel = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=userModel.js.map