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

export const updatePhotoRules = [
  body("title").optional().isString().bail().isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),
  body("url").optional().isString().isURL().withMessage("URL must be a valid URL"),
  body("comment").optional().isString().bail().isLength({ min: 3 }).withMessage("Comment must be at least 3 characters"),
];



