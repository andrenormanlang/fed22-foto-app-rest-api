import bcrypt from 'bcrypt'
import Debug from 'debug'
import { Request, Response } from 'express'
import {matchedData,validationResult} from 'express-validator' //matchedData is another function of express-validator
import prisma from '../prisma'
import { getUserByEmail, updateUser } from '../services/user_service'


const debug = Debug("prisma-books:profile_controller")


/**
 * Get the authenticated user´s profile
 */
export const getProfile = async (req: Request, res: Response) =>{
	// User has authenticated sucessfully
	const profile = await getUserByEmail(req.token!.email)

	//WHO DIS?!
	res.send({
		status: "success",
		data:  {
			id: profile?.id,
            email: profile?.email,
			first_name: profile?.first_name,
			last_name: profile?.last_name,
		},
	})
}

/**
 * Update the authenticated user´s profile
 */
export const updateProfile = async (req: Request, res: Response) => {
	// Check for any validation errors
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		return res.status(400).send({
			status: "fail",
			data: validationErrors.array(),
		})
	}

	// Get ONLY the validated data from the request
	const validatedData = matchedData(req)

	// If user wants to update password, hash and salt it
	if (validatedData.password) {
		const hashedPassword = await bcrypt.hash(validatedData.password, Number(process.env.
		SALT_ROUNDS) ||10)
		console.log("Hashed password:", hashedPassword)

		// Replace password with hashed password
		validatedData.password = hashedPassword
	}

	try{
		// updateUser(validatedData)
		const userData = await updateUser(req.token!.sub, validatedData)

		res.send({status:"success", data:userData})

	} catch{
		return res.status(500).send({
			status: "fail",
            message: "Could not update profile in database"
		})
	}

	//res.send(validatedData) // if you use (req.body) will get the whole data and not only the validations
}


