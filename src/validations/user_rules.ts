/**
 * Validation Rules for User resource
 */
import { body } from "express-validator";
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
  body("email").isEmail().withMessage("This email is not valid").
  custom(async (value) => {
      // check if a User with that email already exists
      const user = await getUserByEmail(value);
      if (user) {
        //if the user already exists respond to the user
        return Promise.reject("Email already exists");
      }
    }),
  body("password").isString().bail().isLength({ min: 6 }).
  withMessage("Password must be at least 6 characters long"),
  body("first_name").isString().bail().isLength({ min: 3 }).
  withMessage("First name must be at least 3 characters long"),
  body("last_name").isString().bail().isLength({ min: 3 }).
  withMessage("Last name must be at least 3 characters long")
  
];

export const createLoginRules = [
  body("email").isEmail().
  withMessage('This is not a valid email').
  custom(async function login(email: string) {
    // Check if a user with the given email exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
  
    if (!user) {
      throw new Error('Invalid email or password')
    }
  
    
  }).
  withMessage('This email does not exist'),

  body("password").isString().bail().isLength({ min: 6 }).
  withMessage('Your password must be at least 6 characters long')
];

export const updateUserRules = [
	body('name').optional().isString().bail().isLength({ min: 3 }),
	body('email').optional().isEmail().custom(async (value: string) => {
		// check if a User with that email already exists
		const user = await getUserByEmail(value)

		if (user) {
			// user already exists, throw a hissy-fit
			return Promise.reject("Email already exists")
		}
	}),
	body('password').optional().isString().bail().isLength({ min: 6 }),
]