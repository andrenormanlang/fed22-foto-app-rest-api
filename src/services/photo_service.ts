import { CreatePhotoData, GetPhotosData } from '../types'
import prisma from '../prisma'

/**
 * Get all photos
 */
export const getPhotos = async (user_id: number) => {
	return await prisma.photo.findMany(
        {
            where: {
                user_id: user_id
            }
        })
}

/**
 * Get a single photo
 *
 * @param photoId The id of the photo to get
 */
export const getPhoto = async (photoId: number) => {
	return await prisma.photo.findUniqueOrThrow({
		where: {
			id: photoId,
		}
	})
}


/**
 * Create a photo
 *
 * @param data Photo Details
 */
export const createPhoto = async (data: CreatePhotoData) => {
    return await prisma.photo.create({ data })
}
