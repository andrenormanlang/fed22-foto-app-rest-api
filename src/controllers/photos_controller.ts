/**
 * Photos Controller
 */
import Debug from 'debug'
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import prisma from '../prisma'

// Create a new debug instance
const debug = Debug('prisma-foto-api:photos_controller')

/**
 * Get all photos
 */
export const index = async (req: Request, res: Response) => {
	try {
		const photos = await prisma.photo.findMany()

		res.send({
			status: "success",
			data: photos,
		})

	} catch (err) {
		console.log("Error thrown when finding photos with id %o: %o", err)
		res.status(500).send({ status: "error", message: "Something went wrong" })
	}
}

/**
 * Get a single photo by id
 */
export const show = async (req: Request, res: Response) => {
    const photoId = Number(req.params.phototId)
	try{
		const photo = await prisma.photo.findUniqueOrThrow({
			where: {
                
				id: photoId,
			}
			
	
		})
		res.send({
			status: "success",
			data: photo,
		})
	}catch (err){
        debug("Error thrown when finding product with id %o: %o", req.params.productId, err)
	 	console.error(err)
	 	res.status(404).send({
		error: "Not found."
	 	})
	}
}

/**
 * Create a photo
 */
export const store = async (req: Request, res: Response) => {
    const validationErrors = validationResult(req)
	if (!validationErrors.isEmpty()){
		return res.status(400).send({
			status: "fail",
			data: validationErrors.array()
		})
	}

	try {
		const photo = await prisma.photo.create({
            data:req.body
         

		})
		res.status(201).send({
			status: "success",
			data: photo
		})
	} catch(err){
        console.log("Error thrown when creating a photo %o: %o", req.body, err)
		res.status(500).send({message:"Something went wrong"})
	}
}

/**
 * Update a photo
 */
export const update = async (req: Request, res: Response) => {
    const photoId = Number(req.params.photoId)

	try {
		const photo = await prisma.photo.update({
			where: {
				id: photoId,
			},
			data: req.body,
		})

		return res.send(photo)

	} catch (err) {
		return res.status(500).send({ message: "Something went wrong" })
	}
}

/**
 * Delete a photo
 */
export const destroy = async (req: Request, res: Response) => {
    const photoId = Number(req.params.photoId)

	// verify that the publisher doesn't have any associated books
	try {
		const photo = await prisma.photo.findUniqueOrThrow({
			where: {
				id: photoId,
			},
		})
    } catch(err){
        return res.status(404).send({ message: "Not found" })
    }
}
