/**
 * Validation Rules for User resource
 */
import { body } from "express-validator";
//import { getUserByEmail } from "../services/user_service";
// problemas nessa importacao
import prisma from '../prisma'

export const getUserByEmail = async (email: string) => {
	return await prisma.user.findUnique({
		where: {
			email: email,
		}
	})
}

export const createUserRules = [
  body("email").isEmail().custom(async (value) => {
      // check if a User with that email already exists
      const user = await getUserByEmail(value);
      if (user) {
        // user already exists, throw a hissy-fit
        return Promise.reject("Email already exists");
      }
    }),
  body("password").isString().bail().isLength({ min: 6 }),
  body("first_name").isString().bail().isLength({ min: 3 }),
  body("last_name").isString().bail().isLength({ min: 3 }),
];
