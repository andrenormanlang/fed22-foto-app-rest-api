import bcrypt from 'bcrypt'
import Debug from 'debug'
import { Request, Response } from 'express'
import { validationResult, matchedData } from 'express-validator'
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../types'
import { createUser, getUserByEmail } from '../services/user_service'

const debug = Debug('api: 🧔‍♀️ user_controller')

export const register = async (req: Request, res: Response) => {
	const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()) {
		return res.status(400).send({
			status: 'fail',
			data: validationErrors.array()
		})
	}
	const validData = matchedData(req)
	const hashedPassword = await bcrypt.hash(validData.password, Number(process.env.SALT_ROUNDS) || 10)
	validData.password = hashedPassword
	try {
		const user = await createUser({
			email: validData.email,
			password: validData.password,
			first_name: validData.first_name,
			last_name: validData.last_name
		})
		res.status(201).send({
			status: 'success',
			data: {
				email: user.email,
				first_name: user.first_name,
				last_name: user.last_name
			}
		})
	} catch (err) {
		return res.status(500).send({
			status: 'error',
			message: "Couldn't create user in database"
		})
	}
}

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body
	const user = await getUserByEmail(email)
	if (!user) {
		return res.status(401).send({
			status: 'fail',
			message: "Authorization required"
		})
	}
	const isPasswordCorrect = await bcrypt.compare(password, user.password)
	if (!isPasswordCorrect) {
		return res.status(401).send({
			status: 'fail',
			message: "Authorization required"
		})
	}
	const payload: JwtPayload = {
		sub: user.id,
		email: user.email,
		first_name: user.first_name,
		last_name: user.last_name
	}
	if (!process.env.ACCESS_TOKEN_SECRET) {
		return res.status(500).send({
			status: 'error',
			message: "No access token secret defined"
		})
	}
	const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '4h'
	})
	if (!process.env.REFRESH_TOKEN_SECRET) {
		return res.status(500).send({
			status: 'error',
			message: "No refresh token secret defined"
		})
	}
	const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: process.env.REFRESH_TOKEN_LIFETIME || '1d'
	})
	res.send({
		status: 'success',
		data: {
			access_token,
			refresh_token
		}
	})
}

export const refresh = (req: Request, res: Response) => {
	if (!req.headers.authorization) {
		debug("Authorization header missing")
		return res.status(401).send({
			status: 'fail',
			data: "Authorization required"
		})
	}
	const [authSchema, token] = req.headers.authorization.split(' ')
	if (authSchema.toLowerCase() !== "bearer") {
		debug("Authorization schema isn't Bearer")
		return res.status(401).send({
			status: 'fail',
			data: "Authorization required"
		})
	}
	try {
		const payload = (jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || '') as unknown) as JwtPayload
		delete payload.iat
		delete payload.exp
		if (!process.env.ACCESS_TOKEN_SECRET) {
			return res.status(500).send({
				status: 'error',
				message: "No access token secret defined"
			})
		}
		const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '4h'
		})
		res.send({
			status: 'success',
			data: {
				access_token
			}
		})
	} catch (err) {
		debug("Token failed verification", err)
		return res.status(401).send({
			status: 'fail',
			data: "Authorization required"
		})
	}
}