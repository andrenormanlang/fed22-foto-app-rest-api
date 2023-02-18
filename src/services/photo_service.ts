import { CreatePhotoData,  UpdatePhotoData } from '../types'
import prisma from '../prisma'
import {NotFound, Forbidden} from 'http-errors'

/**
 * Get all photos
 */
export const getPhotos = async (user_id: number) => {
	return await prisma.photo.findMany(
        {
            where: {
                user_id: user_id
            },
            select: {
                id: true,
                title: true,
                url: true,
                comment: true
            }    
        })
}


/**
 * Get a single photo
 *
 * @param photoId The id of the photo to get
 */
export const getPhoto = async (photoId: number) => {

      return await prisma.photo.findUnique({
        where: {
          id: photoId,
          
        },
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

/**
 * Update a photo
 *
 * @param data Photo Details
 */
export const updatePhoto = async (photoId: number, userData: UpdatePhotoData, user_id:number) => {
  const photo = await getPhoto(photoId);
  
  if (!photo) {
    throw NotFound('Photo not found');
  }

  if (photo.user_id !== user_id) {
    throw Forbidden('Not authorized to access this photo');
  }
  
  return await prisma.photo.update({
    where: {
      id: photoId,    
    },
    data: userData,
  });
}

/**
 * Delete a photo
 *
 * @param data Photo Details
 */
export const deletePhoto = async (photoId: number, user_id:number) => {
  
    const photo = await getPhoto(photoId)

    if (!photo) {
      throw NotFound('Photo not found');
    }
    if (photo.user_id !== user_id) {
      throw Forbidden('Not authorized to access this photo');
    }
    return await prisma.photo.delete({
    where: {
      id: photoId,
    },
  });
}