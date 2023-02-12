
import Debug from 'debug'
import { Request, Response } from 'express'
import prisma from '../prisma'
//import { getUserByEmail } from '../services/user_service'

const debug = Debug("prisma-books:profile_controller")

export const getUserByEmail = async (email: string) => {
	return await prisma.user.findUnique({
		where: {
			email: email,
		}
	})
}

/**
 * Get the authenticated user´s profile
 */
export const getProfile = async (req: Request, res: Response) =>{
	//User has authenticated sucessfully
	const profile = await getUserByEmail(req.token!.email)

	//WHO DIS?!
	res.send({
		status: "success",
		data:  req.body
			

		,
	})
}