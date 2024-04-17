/**
 * Router Template
 */
import express from 'express'
import { index, show, store, update, destroy, /*addPhotoToAlbum,*/ addPhotosToAlbum, removePhoto } from '../controllers/albums_controller'
import { createAlbumRules, updateAlbumRules  } from '../validations/album_rules'

const router = express.Router()

/**
 * GET / albums
 */
router.get('/', index)

/**
 * GET /albums/:albumId
 */
router.get('/:albumId', show)

/**
 * POST /photos
 */
router.post('/', createAlbumRules, store)


/**
 * POST /add a photo to an album // blocked for now
 */
// router.post('/:albumId/photos', addPhotoToAlbum)

/**
 * POST /multiple photos to an album
 */
router.post('/:albumId/photos', addPhotosToAlbum)

/**
 * POST / delete a photo from an album
 */
router.delete('/:albumId/photos/:photoId', removePhoto)


/**
 * PATCH /albums/:resourceId
 */
router.patch('/:albumId', updateAlbumRules, update)

/**
 * DELETE /resource/:resourceId
 */
router.delete('/:albumId', destroy)

export default router
