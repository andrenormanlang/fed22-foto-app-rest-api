import { CreateAlbumData, UpdateAlbumData, GetPhotosData } from '../types'
import prisma from '../prisma'
import {NotFound, Forbidden, HttpError} from 'http-errors'

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
 * Add multiple photos to a Album
 *
 * @param data Album Details
 */
export const addPhotos = async (albumId: number, photoIds: number[], user_id: number) => {
  const album = await prisma.album.findUnique({ where: { id: albumId } });
  if (!album) {
    throw new NotFound('Album not found');
  }
  if (album.user_id !== user_id) {
    throw new Forbidden('Not authorized to access this album');
  }
  
  const photos = await prisma.photo.findMany({
    where: { id: { in: photoIds } }
  });
  if (photos.length !== photoIds.length) {
    const existingPhotoIds = photos.map((photo) => photo.id);
    const nonExistingPhotoIds = photoIds.filter((id) => !existingPhotoIds.includes(id));
    throw new Forbidden(`The following photoIds do not exist: ${nonExistingPhotoIds.join(', ')}`);
  }

  const userIds = photos.map((photo) => photo.user_id);
  if (userIds.some((id) => id !== user_id)) {
    throw new Forbidden('You do not have permission to add some of the photos to the album');
  }

  await prisma.album.update({
    where: { id: albumId },
    data: {
      photos: {
        connect: photoIds.map((id: number) => ({ id }))
      }
    },
    include: { photos: true }
  });
};

/**
 * Remove a photo from a Album but not the photo itself
 *
 * @param data Album Details
 */
export const removePhotoFromAlbum = async (albumId: number, photoId: number) => {
  const album = await prisma.album.findUnique({
    where: { id: albumId },
    select: { photos: true },
  });

  if (!album) {
    throw NotFound('Album not found');
  }

  const photo = album.photos.find((p:GetPhotosData) => p.id === photoId);

  if (!photo) {
    throw NotFound('Photo not found');
  }

  await prisma.album.update({
    where: { id: albumId },
    data: {
      photos: {
        disconnect: { id: photoId },
      },
    },
  });
};

export const getAlbumUser = async (albumId: number) => {
  return await prisma.album.findUnique({
    where: { id: albumId },
    include: { user: true },
  });
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