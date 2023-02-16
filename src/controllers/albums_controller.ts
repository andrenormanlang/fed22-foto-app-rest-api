/**
 * 
 * Photos Controller
 */
import Debug from 'debug'
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import prisma from '../prisma'
import { createAlbum, getAlbums, getAlbum, updateAlbum, deleteAlbum, removePhotoFromAlbum   } from '../services/album_service'
import {Album} from '../types'
// Create a new debug instance
const debug = Debug('prisma-foto-api:photos_controller')

/**
 * Get all albums from the logged in user
 */
export const index = async (req: Request, res: Response) => {
	const user_id = Number(req.token!.sub)
	
	try {
		const albums = await getAlbums(user_id)
	

		res.send({
			status: "success",
			data: albums,
		})

	} catch (err) {
		console.log("Error thrown when finding albums with id %o: %o", err)
		res.status(500).send({ status: "error", message: "Something went wrong" })
	}
}

export const show = async (req: Request, res: Response) => {

	const albumId = Number(req.params.albumId)

	const user_id = Number(req.token!.sub)

	try {
	const album = await getAlbum(albumId);

	if (!album) {
		return res.status(404).send({
		status: "fail",
		message: "Album not found"
		});
	}

	if (album.user_id !== user_id) {
		return res.status(403).send({
		status: "fail",
		message: "Not authorized to access this album"
		});
	}

	const photos = album.photos.map((photo) => ({
		id: photo.id,
		title: photo.title,
		url: photo.url,
		comment: photo.comment,
		user_id: photo.user_id
	  }));

	return res.status(200).send({
		status: "success",
		data: {
		id:	album.id,
		title: album.title,
		user_id: album.user_id,	
		photos: photos
		}
		
	});

	} catch (err) {
	debug("Error thrown when finding photo with id %o: %o", req.params.photoId, err)
	return res.status(500).send({
		status: 'error',
		message: 'Could not get the album'
	});
	}
};

/**
 * Create a album
 */
export const store = async (req: Request, res: Response) => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array()
        })
    }

    const { title } = req.body

    try {
        const album = await createAlbum({
            title,
            user_id: Number(req.token!.sub),
        })

        res.status(201).send({
            status: "success",
            data: album,
        })
    }
    catch (err) {
        res.status(500).send({
            status: "error",
            message: "Could not create album in database",
        }) 
    }
}


/**
 * Add a photo to a album
 */
export const addPhotoToAlbum = async (req: Request, res: Response) => {
	const albumId = Number(req.params.albumId);
	const photoId = Number(req.body.photoId);
	const user_id = Number(req.token!.sub);

	const album = await prisma.album.findUnique({ where: { id: albumId } });
	const user = req.user;
	if (!album) {
		return res.status(404).send({
		status: "error",
		message: "Album not found"
		});
  	}
	  if (!album || album.user_id !==  user_id) {
		return res.status(403).send({
		  status: "error",
		  message: "You do not have permission to modify this album"
		});
	  }

	  const photo = await prisma.photo.findUnique({ where: { id: photoId } });
		if (!photo || photo.user_id !== user_id) {
			return res.status(403).send({
			status: "error",
			message: "You do not have permission to add this photo to the album"
			});
		}

	const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array()
        })
    }
  
	try {
	  const album = await prisma.album.update({
		where: { id: albumId },
		data: {
		  photos: {
			connect: { id: photoId }
		  }
		},
		include: { photos: true }
	  });

	  res.status(201).send({
		status: "success",
		data: null
	  });
	} catch (err) {
	  res.status(500).send({
		status: "error",
		message: "Could not add photo to album"
	  });
	}
  };


/**
 * Add multiple photos to a album
 */
export const addPhotosToAlbum = async (req: Request, res: Response) => {
	const albumId = Number(req.params.albumId);
	const photo_id = req.body.photo_id;
	if (!photo_id) {
	  return res.status(400).send({
		status: "fail",
		message: "Missing photos in request body"
	  });
	}
	const photo_idArray = photo_id.map(Number);
	const user_id = Number(req.token!.sub);
  
	const album = await prisma.album.findUnique({ where: { id: albumId } });
	const user = req.user;
	if (!album) {
	  return res.status(404).send({
		status: "error",
		message: "Album not found"
	  });
	}
	if (!album || album.user_id !== user_id) {
	  return res.status(403).send({
		status: "error",
		message: "You do not have permission to modify this album"
	  });
	}
  
	const photos = await prisma.photo.findMany({
	  where: { id: { in: photo_idArray }, user_id }
	});
	if (photos.length !== photo_idArray.length) {
	  return res.status(403).send({
		status: "error",
		message: "You do not have permission to add some of the photos to the album"
	  });
	}
  
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
	  return res.status(400).send({
		status: "fail",
		data: validationErrors.array()
	  });
	}
  
	try {
	    await prisma.album.update({
		where: { id: albumId },
		data: {
		  photos: {
			connect: photo_idArray.map((id: number) => ({ id }))
		  }
		},
		include: { photos: true }
	  });
  
	  res.status(201).send({
		status: "success",
		data: null
	  });
	} catch (err) {
	  res.status(500).send({
		status: "error",
		message: "Could not add photos to album"
	  });
	}
  };


/**
 * Remove a photo a album
 */
export const removePhoto = async (req: Request, res: Response) => {
	const albumId = Number(req.params.albumId);
	const photoId = Number(req.params.photoId);
	const userId = Number(req.token!.sub);
  
	try {
	  const album = await prisma.album.findUnique({
		where: { id: albumId },
		include: { user: true },
	  });
  
	  if (!album) {
		return res.status(404).send({
		  status: 'fail',
		  message: 'Album not found',
		});
	  }
  
	  if (album.user.id !== userId) {
		return res.status(403).send({
		  status: 'fail',
		  message: 'Not authorized to access this album',
		});
	  }
  
	  await removePhotoFromAlbum(albumId, photoId);
  
	  return res.status(200).send({
		status: 'success',
		data: null
		  ,
	  });
	} catch (err) {
	  console.error(err);
	  return res.status(500).send({
		status: 'error',
		message: 'Could not remove photo from album',
	  });
	}
  };

/**
 * Update a album
 */
  export const update = async (req: Request, res: Response) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
	  return res.status(400).send({
		status: "fail",
		data: validationErrors.array()
	  });
	}
	const albumId = Number(req.params.albumId);
	const user_id = Number(req.token!.sub);
  
	try {
	  let album: Album | null = await getAlbum(albumId);
  
	  if (!album) {
		return res.status(404).send({
		  status: "fail",
		  message: "Album not found",
		});
	  }
  
	  if (album.user_id !== user_id) {
		return res.status(403).send({
		  status: "fail",
		  message: "Not authorized to access this album",
		});
	  }
  
	  album = await updateAlbum(albumId, req.body);
  
	  return res.status(200).send({
		status: "success",
		data: {
		  title: album?.title,
		  user_id: user_id,
		  id: album?.id
		},
	  });
	} catch (err) {
	  return res.status(500).send({
		status: "error",
		message: "Could not update the album",
	  });
	}
  }


/**
 * Delete an album
 * Obs: Delete an album (including the links to photos but not the photos themselves) 
 */
export const destroy = async (req: Request, res: Response) => {
	const albumId = Number(req.params.albumId);
  const user_id = Number(req.token!.sub);

  try {
    const album = await getAlbum(albumId);

    if (!album) {
      return res.status(404).send({
        status: 'fail',
        message: 'Album not found',
      });
    }

    if (album.user_id !== user_id) {
      return res.status(403).send({
        status: 'fail',
        message: 'Not authorized to access this album',
      });
    }

    // Delete the album
    await deleteAlbum(albumId);

    return res.status(200).send({
      status: 'success',
      data: null,
    });
  } catch (err) {
    debug('Error thrown when finding album with id %o: %o', req.params.albumId, err);
    return res.status(500).send({
      status: 'error',
      message: 'Could not delete the album',
    });
  }
  };
	




