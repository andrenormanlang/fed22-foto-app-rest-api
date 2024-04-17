/**
 * Controller Template
 */
import bcrypt from 'bcrypt'
import Debug from 'debug'
import { Request, Response } from 'express'
import { matchedData, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { createUser, getUserByEmail } from '../services/user_service'
import { JwtPayload } from '../types'


// Create a new debug instance
const debug = Debug('photo-album-api:user_controller')

/**
 * Login a user
 */
export const login = async (req: Request, res: Response) => {
    const user = await getUserByEmail(req.body.email)
    if (!user) {
        return res.status(401).send({
            status: "fail",
            message: "Authorization required",
        })
    }

    const { email, first_name, last_name } = user

    const passwordComparison = await bcrypt.compare(req.body.password, user.password)
    if (!passwordComparison) {
        return res.status(401).send({
            status: "fail",
            message: "Authorization required",
        })
    }

    const payload: JwtPayload = {
        sub: user.id,
        email,
        first_name,
        last_name,
    }

    const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFETIME } = process.env

    if (!ACCESS_TOKEN_SECRET) {
        return res.status(401).send({
            status: "fail",
            message: "no ACCESS_TOKEN_SECRET defined",
        })
    }

    const access_token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_LIFETIME || '4h'
    })

    if (!REFRESH_TOKEN_SECRET) {
        return res.status(401).send({
            status: "fail",
            message: "no REFRESH_TOKEN_SECRET defined",
        })
    }

    const refresh_token = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_LIFETIME || '1d'
    })

    res.send({
        status: "success",
        data: {
            access_token,
            refresh_token,
        }
    })
}

/**
 * Register a user
 */
export const register = async (req: Request, res: Response) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array()
        })
    }

    const validatedData = matchedData(req)
    const hashedPassword = await bcrypt.hash(validatedData.password, process.env.SALT_ROUNDS || 10)
    validatedData.password = hashedPassword

    const { email, password, first_name, last_name } = validatedData
    console.log(validatedData);

    try {
        await createUser({
            email,
            password,
            first_name,
            last_name,
        })

        res.status(201).send({
            status: "success",
            data: {
                email,
                first_name,
                last_name,
            },
        })
    }
    catch (err) {
        res.status(500).send({
            status: "error",
            message: "Could not create user in database",
        })
    }
}

/**
 * Refresh access_token
 */
export const refresh = async (req: Request, res: Response) => {
    if (!req.headers.authorization) {
        return res.status(401).send({
            status: "fail",
            message: "Authorization required",
        })
    }
   
    const [ authSchema, token ] = req.headers.authorization.split(' ')

    if (authSchema.toLocaleLowerCase() !== 'bearer') {
        return res.status(401).send({
            status: "fail",
            message: "Authorization required",
        })
    }

    try {
        const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_SECRET } = process.env

        const refresh_payload = (jwt.verify(token, REFRESH_TOKEN_SECRET || "") as unknown) as JwtPayload
        const { sub, email, first_name, last_name } = refresh_payload

        const payload: JwtPayload = {
            sub,
            email,
            first_name,
            last_name,
        }
       
        if (!ACCESS_TOKEN_SECRET) {
            debug("No ACCESS_TOKEN_SECRET defined")
   
            return res.status(500).send({
                status: "error",
                data: "No ACCESS_TOKEN_SECRET defined",
            })
        }
   
        const access_token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_LIFETIME || '4h',
        })

        res.send({
            status: "success",
            data: {
                access_token,
            }
        })
    }
    catch (err) {
        return res.status(401).send({
            status: "fail",
            message: "Authorization required",
        })
    }
}

