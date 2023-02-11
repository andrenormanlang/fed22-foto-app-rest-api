/**
 * Controller Template
 */
import bcrypt from 'bcrypt'
import Debug from 'debug'
import { Request, Response } from 'express'
import { matchedData,validationResult } from 'express-validator'
import prisma from '../prisma'

// Create a new debug instance
const debug = Debug('prisma-boilerplate:I_AM_LAZY_AND_HAVE_NOT_CHANGED_THIS_😛')

/**
 * Get all resources
 */
export const index = async (req: Request, res: Response) => {
}

/**
 * Get a single resource
 */
export const show = async (req: Request, res: Response) => {
}

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response) => {
    // Check for any validation errors
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		return res.status(400).send({
			status: "fail",
			data: validationErrors.array(),
		})
    }

    //Check if a user with the incoming email already exists (other way of doing the handling)
	//const user = await prisma.user.findUnique()

    // Get only the validated data from the request
	const validatedData = matchedData(req)
	console.log("validatedData:", validatedData)

    // Calculate a hash + salt for the password
	const hashedPassword = await bcrypt.hash(validatedData.password, Number(process.env.SALT_ROUNDS) || 10)
	console.log("Hashed password:", hashedPassword)

    // Replace password with hashed password
	validatedData.password = hashedPassword

    // Store the user in the database
	try {
		const user = await prisma.user.create({
			data:{
				email: validatedData.email,
                password: validatedData.password,
                first_name:validatedData.first_name,
				last_name: validatedData.last_name,
			},
		})

        // Respond with 201 Created + status success
		res.status(201).send({ 
			status: "success", 
			data: {
				id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            },
			
		})
	} catch (err) {
		return res.status(500).send({ status: "error", message: "Could not create user in database" })
	}
}
/**
 * Update a resource
 */
export const update = async (req: Request, res: Response) => {
}


/**
 * Delete a resource
 */
export const destroy = async (req: Request, res: Response) => {
}
