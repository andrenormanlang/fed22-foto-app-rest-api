/**
 * Validation Rules for User resource
 */
import { body } from "express-validator";
//import { getUserByEmail } from "../services/user_service";
// problemas nessa importacao
import prisma from '../prisma'

export const createAlbumRules = [
  body("title").isString().bail().isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),
];

export const updateAlbumRules = [
  body("title").isString().bail().isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),
];




