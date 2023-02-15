import { CreateAlbumData } from '../types'
import prisma from '../prisma'

/**
 * Get all albums
 */
export const getAlbums = async (user_id: number) => {
	return await prisma.album.findMany(
        {
            where: {
                user_id: user_id
            }
        })
}


/**
 * Get a single Album
 *
 * @param albumId The id of the album to get
 */
export const getPhoto = async (photoId: number) => {

      return await prisma.photo.findUniqueOrThrow({
        where: {
          id: photoId,
          
        },
      })
}


/**
 * Create a Album
 *
 * @param data Album Details with title only
 */
export const createAlbum = async (data: CreateAlbumData) => {
    return await prisma.album.create({ data })
}

/**
 * Update a photo
 *
 * @param data Photo Details
 */
// export const updatePhoto = async (photoId: number, userData: UpdatePhotoData, user_id: number) => {
//   const photo = await prisma.photo.findUnique({
//     where: {
//       id: photoId,
//     },
//   });

//   if (!photo) {
//     throw new Error('Photo not found');
//   }

//   if (photo.user_id !== user_id) {
//     throw new Error('Not authorized to update this photo');
//   }

//   return await prisma.photo.update({
//     where: {
//       id: photoId,
//     },
//     data: userData,
//   });
// }

/**
 * Delete a photo
 *
 * @param data Photo Details
 */
export const deletePhoto = async (photoId: number, user_id: number) => {
  const photo = await prisma.photo.findUnique({
    where: {
      id: photoId,
    },
  });

  if (!photo) {
    throw new Error('Photo not found');
  }

  if (photo.user_id !== user_id) {
    throw new Error('Not authorized to delete this photo');
  }

  return await prisma.photo.delete({
    where: {
      id: photoId,
    },
  });
}