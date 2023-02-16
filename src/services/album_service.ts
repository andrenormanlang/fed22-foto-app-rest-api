import { CreateAlbumData, UpdateAlbumData } from '../types'
import prisma from '../prisma'

/**
 * Create a Album
 *
 * @param data Album Details with title only
 */
export const createAlbum = async (data: CreateAlbumData) => {
  return await prisma.album.create({ data })
}


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
export const getAlbum = async (albumId: number) => {

      return await prisma.album.findUnique({
        where: {
          id: albumId,
            
        },
        include: {
          photos: true
        }
      })
}


/**
 * Add a photo to a Album
 *
 * @param data Album Details
 */
// export const addPhoto = async (albumId: number, photoId: number) => {
// 	prisma.album.update({
// 		where: { id: albumId },
// 		data: {
// 		  photos: {
// 			connect: { id: photoId }
// 		  }
// 		},
// 		include: { photos: true }
// 	  });

// }

/**
 * Remove a photo from a Album but not the photo itself
 *
 * @param data Album Details
 */
export const removePhotoFromAlbum = async (albumId: number, photoId: number) => {
  const album = await prisma.album.findUnique({
    where: { id: albumId },
    include: { photos: true },
  });

  if (!album) {
    throw new Error('Album not found');
  }

  const photoIndex = album.photos.findIndex((photo) => photo.id === photoId);

  if (photoIndex === -1) {
    throw new Error('Photo not found in album');
  }

  const updatedAlbum = await prisma.album.update({
    where: { id: albumId },
    data: { photos: { disconnect: { id: photoId } } },
    include: { photos: true },
  });

  return updatedAlbum;
};


/**
 * Update a album
 *
 * @param data Photo Details
 */
export const updateAlbum = async (albumId: number, userData: UpdateAlbumData) => {
  return await prisma.album.update({
    where: {
      id: albumId,    
    },
    data: userData,
  });
}

/**
 * Delete a Album
 *
 * @param data Album Details
 */
export const deleteAlbum = async (albumId: number) => {
  return await prisma.album.delete({
    where: { id: albumId },
  });
};