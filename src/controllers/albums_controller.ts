/**
 * 
 * Photos Controller
 */
import Debug from 'debug'
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { createAlbum, getAlbums, getAlbum, updateAlbum, /*addPhoto,*/ addPhotos, deleteAlbum, removePhotoFromAlbum, getAlbumUser} from '../services/album_service'
import {Album} from '../types'
import {HttpError, NotFound, Forbidden} from  'http-errors'
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
// export const addPhotoToAlbum = async (req: Request, res: Response) => {
// 	const albumId = Number(req.params.albumId);
// 	const photoId = Number(req.body.photo_id);
// 	const userId = Number(req.token!.sub);
  
// 	try {
// 	  await addPhoto(albumId, photoId, userId);
  
// 	  return res.status(200).send({
// 		status: 'success',
// 		data: null,
// 	  });
// 	} catch (err: any) {
// 	  console.error(err);
// 	  if (err.message === 'Album not found' || err.message === 'Photo not found') {
// 		return res.status(404).send({
// 		  status: 'fail',
// 		  message: err.message,
// 		});
// 	  }
// 	  if (err.message === 'Not authorized to access this album' || err.message === 'You do not have permission to add this photo to the album') {
// 		return res.status(403).send({
// 		  status: 'fail',
// 		  message: err.message,
// 		});
// 	  }
// 	  return res.status(500).send({
// 		status: 'error',
// 		message: 'Could not add photo to album',
// 	  });
// 	}
//   };


/**
 * Add multiple photos to a album
 */
export const addPhotosToAlbum = async (req: Request, res: Response) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
	  return res.status(400).send({
		status: "fail",
		data: validationErrors.array()
	  });
	}
  
	try {
	  const albumId = Number(req.params.albumId);
	  const photoIds = req.body.photo_id;
  
	  if (!photoIds || !Array.isArray(photoIds) || photoIds.length === 0) {
		return res.status(400).send({
		  status: "fail",
		  message: "Invalid photo_id parameter in request body",
		});
	  }
  
	  const invalidIds = photoIds.filter(id => isNaN(Number(id)));
	  if (invalidIds.length > 0) {
		return res.status(400).send({
		  status: "fail",
		  message: "Invalid photo_id parameter in request body",
		});
	  }
  
	  const user_id = Number(req.token!.sub);
	  await addPhotos(albumId, photoIds.map(id => Number(id)), user_id);
  
	  return res.status(200).send({
		status: "success",
		data: null,
	  });
	} catch (err) {
	  if (err instanceof NotFound) {
		return res.status(404).send({
		  status: "error",
		  message: err.message,
		});
	  } else if (err instanceof Forbidden) {
		return res.status(403).send({
		  status: "error",
		  message: err.message,
		});
	  } else {
		return res.status(500).send({
		  status: "error",
		  message: "Internal Server Error",
		});
	  }
	}
  };
  
/**
 * Remove a photo from a album
 */
export const removePhoto = async (req: Request, res: Response) => {
	const albumId = Number(req.params.albumId);
	const photoId = Number(req.params.photoId);
	const userId = Number(req.token!.sub);
  
	try {
	  const album = await getAlbumUser(albumId);
  
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
		data: null,
	  });
	} catch (err: any) {
	  console.error(err);
	  if (err.message === 'Album not found' || err.message === 'Photo not found') {
		return res.status(404).send({
		  status: 'fail',
		  message: err.message,
		});
	  }
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
	




