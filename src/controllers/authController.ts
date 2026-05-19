// imports
import {
  type Request,
  type Response,
  type NextFunction
} from "express";

import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import Joi, { ValidationResult } from "joi";

// Project imports
import { userModel } from "../models/userModel";
import { User } from "../interfaces/user";

/**
 * Register a new user
 */
export async function registerUser(req: Request, res: Response) {
  try {
    const { error } = validateUserRegistrationInfo(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const emailExists = await userModel.findOne({ email: req.body.email });
    if (emailExists) {
      res.status(409).json({ error: "Email already exists." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(req.body.password, salt);

    const userObject = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: passwordHashed
    });

    const savedUser = await userObject.save();
    res.status(201).json({ error: null, data: savedUser._id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}


/**
 * Login an existing user
 */
export async function loginUser(req: Request, res: Response) {
  try {
    const { error } = validateUserLoginInfo(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const user: User | null = await userModel.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({ error: "Password or email is wrong." });
      return;
    }

    const validPassword: boolean = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      res.status(400).json({ error: "Password or email is wrong." });
      return;
    }

    const userId: string = user.id!;
    const token: string = jwt.sign(
      { name: user.name, email: user.email, id: userId },
      process.env.TOKEN_SECRET as string,
      { expiresIn: '2h' }
    );

    res.status(200).header("auth-token", token).json({ error: null, data: { userId, token } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}


/**
 * Middleware to verify the JWT token in the request header
 */
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header("auth-token");

  if (!token) {
    res.status(400).json({ error: "Access Denied." });
    return;
  }

  try {
    jwt.verify(token, process.env.TOKEN_SECRET as string);
    next();
  } catch {
    res.status(401).json({ error: "Invalid Token." });
  }
}


/**
 * Validate user registration input
 */
export function validateUserRegistrationInfo(data: User): ValidationResult {
  const schema = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().email().min(6).max(255).required(),
    password: Joi.string().min(6).max(255).required()
  });
  return schema.validate(data);
}


/**
 * Validate user login input
 */
export function validateUserLoginInfo(data: User): ValidationResult {
  const schema = Joi.object({
    email: Joi.string().email().min(6).max(255).required(),
    password: Joi.string().min(6).max(255).required()
  });
  return schema.validate(data);
}
