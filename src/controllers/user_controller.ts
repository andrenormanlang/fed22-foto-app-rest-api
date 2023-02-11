/**
 * Controller Template
 */
import bcrypt from 'bcrypt'
import Debug from 'debug'
import { Request, Response } from 'express'
import { matchedData, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import prisma from '../prisma'
import { JwtPayload } from '../types'
//import { createUser, getUserByEmail } from './../services/user_service';

// Create a new debug instance
const debug = Debug('prisma-foto-api:jwt')

// Delete after correction with module import
export const getUserByEmail = async (email: string) => {
	return await prisma.user.findUnique({
		where: {
			email: email,
		}
	})
}

export const createUser = async (data: CreateUserData) => {
	return await  prisma.user.create({
		data: data
	})
}

export type CreateUserData = {
	email: string,
	password: string,
	first_name: string,
    last_name: string,
}


//Login as user
export const login = async (req: Request, res: Response) => {
	// destructure email and password from request body
	const {email, password} = req.body

	//find user email, otherwise bail 🛑
	const user = await getUserByEmail(email)
	if (!user) {
        return res.status(401).send({
            status: 'fail',
			message: 'Authorization required'
        })

    }

	// verify hash agains credentials, otherwise bail 🛑
	const result = await bcrypt.compare(password, user.password)
	if (!result) {
		return res.status(401).send({
            status: 'fail',
			message: 'Authorization required'
        })
    }

	//construct jwt-payload
	const payload: JwtPayload = {
        sub: user.id, //users id // sub = subject the token is issued for
		email: user.email,
		first_name: user.first_name,
		last_name: user.last_name,
    }

	// sign payload with secret and get access token
	if (!process.env.ACCESS_TOKEN_SECRET) {
		return res.status(500).send({
			status: "error",
			message: "No access token secret defined",
		})
	}
	const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '4h',
	})


	// sign payload with refresh-token secret and get refresh-token
	if (!process.env.REFRESH_TOKEN_SECRET) {
		return res.status(500).send({
			status: "error",
			message: "No refresh token secret defined",
		})
	}

	const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: process.env.REFRESH_TOKEN_LIFETIME || '1d',
	})

	// respond with access- and refresh-token
	res.send({
		status: "success",
		data: {
			access_token, // access_token: access_token
			refresh_token,
		}
	})
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
				last_name:validatedData.last_name,
            }
			
		})

		// Respond with 201 Created + status success
		res.status(201).send({ 
			status: "success", 
			data: {
				id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            }	 
		})
	} catch (err) {
		return res.status(500).send({ status: "error", message: "Could not create user in database" })
	}
}

/**
 * Refresh token
 *
 * Receives as refresh token and issues	a new access token
 *
 * Authorization: Bearer <refresh-token>
 */


export const refresh = async (req: Request, res: Response) => {

	// Make sure authorization header exists
	debug(req.headers)
	if (!req.headers.authorization) {
		debug("Authorization header missing")

		return res.status(401).send({
			status: "fail",
			data: "Authorization required",
		})
	}

	// Split authorization header on ' '
	const [authSchema, token] = req.headers.authorization.split(" ")

	// Make sure Authorization schema is "Bearer"
	if (authSchema.toLowerCase() !== "bearer") {
		debug("Authorization schema isn't Bearer")

		return res.status(401).send({
			status: "fail",
			data: "Authorization required",
		})
	}
	// Verify refresh token and get refresh token payload
	try {
		// Verify refresh token using the refresh token secret
		//const {sub,name,email} = (jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || "") as unknown) as JwtPayload
		const payload = (jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || "") as unknown) as JwtPayload

		// Construct access token payload

		// const payload: JwtPayload = {
        //     sub, //users id // sub = subject the token is issued for
		// 	   name,
        //     email,
		// }

		// Remove 'iat' and 'exp' from refresh token payload
		delete payload.exp
		delete payload.iat

		// Issue a new access token
		if(!process.env.ACCESS_TOKEN_SECRET){
			return res.status(500).send({
                status: "error",
                message: "No access token secret defined",
            })
		}
		const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '4h',
        })
		//

		//Respond with new access token
		res.send({
			status: "success",
			data: {
				access_token, // access_token: access_token
            },

		})

	} catch(err) {
		debug("Refresh token failed verification", err)

		//return res.jsend.fail("") //Possibly works with express or typescript but not sure
		return res.status(401).send({
            status: 'fail',
            data: "Authorization required"
        })
	}

}