/**
* JWT Authentication Middleware
*/
//import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import  Debug  from 'debug'
import {Request, Response, NextFunction} from 'express'
import { JwtPayload } from '../../types'
// problemas nessa importacao

const debug = Debug('foto-api:jwt')

/**
* Validate JWT Access Token
*
*Authorization: Bearer <token>
*/

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
	debug("Hello from auth/jwt!")

	// Make sure authorization header exists, otherwise fail 🛑
	if (!req.headers.authorization) {
		debug("Authorization header missing")

		return res.status(401).send({
			status: "fail",
			data: "Authorization required",
		})
	}

	// Split authorization header on ' '
	// "Bearer <token>"
	const [authSchema, token] = req.headers.authorization.split(" ")

	// Check that Authorization scheme is "Bearer", otherwise bail 🛑
	if (authSchema.toLowerCase() !== "bearer") {
		debug("Authorization schema isn't Bearer")

		return res.status(401).send({
			status: "fail",
			data: "Authorization required",
		})
	}

	// Verify token(and extract payload) and attach payload to request, otherwise bail 🛑
	try {
		const payload = (jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "") as unknown) as JwtPayload
		debug("Yay got 📦: %o", payload)

		// Attach payload to request
		req.token = payload

	} catch(err) {
		debug("Token verification failed", err)

		//return res.jsend.fail("") //Possibly works with express or typescript but not sure
		return res.status(401).send({
            status: 'fail',
            data: "Authorization required"
        })
	}

	// Attach user to request

	//pass request along
	next()
}

