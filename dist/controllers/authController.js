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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.verifyToken = verifyToken;
exports.validateUserRegistrationInfo = validateUserRegistrationInfo;
exports.validateUserLoginInfo = validateUserLoginInfo;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("joi"));
// Project imports
const userModel_1 = require("../models/userModel");
const database_1 = require("../repository/database");
/**
 * Register a new user
 * @param req
 * @param res
 * @returns
 */
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // check if the user registration info is valid
            const { error } = validateUserRegistrationInfo(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message });
                return;
            }
            yield (0, database_1.connect)();
            // check if the email is already registered
            const emailExists = yield userModel_1.userModel.findOne({ email: req.body.email });
            if (emailExists) {
                res.status(409).json({ error: "Email already exists." });
                return;
            }
            // hash the password before saving the user to the repository
            const salt = yield bcrypt_1.default.genSalt(10);
            const passwordHashed = yield bcrypt_1.default.hash(req.body.password, salt);
            // create a new user object and save it to the repository
            const userObject = new userModel_1.userModel({
                name: req.body.name,
                email: req.body.email,
                password: passwordHashed
            });
            const savedUser = yield userObject.save();
            res.status(201).json({ error: null, data: savedUser._id });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Internal server error"
            });
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
;
/**
 * Login an existing user
 * @param req
 * @param res
 * @returns
 */
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // validate user login info
            const { error } = validateUserLoginInfo(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message });
                return;
            }
            // find the user in the repository
            yield (0, database_1.connect)();
            const user = yield userModel_1.userModel.findOne({ email: req.body.email });
            if (!user) {
                res.status(400).json({ error: "Password or email is wrong." });
                return;
            }
            else {
                // create and assign a token to the user
                const validPassword = yield bcrypt_1.default.compare(req.body.password, user.password);
                if (!validPassword) {
                    res.status(400).json({ error: "Password or email is wrong." });
                    return;
                }
                const userId = user.id;
                const token = jsonwebtoken_1.default.sign({
                    // payload
                    name: user.name,
                    email: user.email,
                    id: userId
                }, process.env.TOKEN_SECRET, { expiresIn: '2h' });
                // add the token to the response header and send it back to the client
                res.status(200).header("auth-token", token).json({ error: null, data: { userId, token } });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Internal server error"
            });
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
;
/**
 * Middleware function to verify the token sent by the client in the request header
 * @param req
 * @param res
 * @param next
 */
function verifyToken(req, res, next) {
    const token = req.header("auth-token");
    if (!token) {
        res.status(400).json({ error: "Access Denied." });
        return;
    }
    try {
        if (token)
            jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        next();
    }
    catch (_a) {
        res.status(401).send("Invalid Token");
    }
}
/**
 * Check if the user registration info is valid
 * @param data
 */
function validateUserRegistrationInfo(data) {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(6).max(255).required(),
        email: joi_1.default.string().email().min(6).max(255).required(),
        password: joi_1.default.string().min(6).max(20).required()
    });
    return schema.validate(data);
}
/**
 * Check if the user login info is valid
 * @param data
 */
function validateUserLoginInfo(data) {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().min(6).max(255).required(),
        password: joi_1.default.string().min(6).max(20).required()
    });
    return schema.validate(data);
}
//# sourceMappingURL=authController.js.map