/**
 * Router Template
 */
import express from 'express'
import { index, show, store, update, destroy } from '../controllers/albums_controller'
import { createAlbumRules, updatePhotoRules  } from '../validations/album_rules'

const router = express.Router()

/**
 * GET /resource
 */
router.get('/', index)

/**
 * GET /resource/:resourceId
 */
router.get('/:albumId', show)

/**
 * POST /resource
 */
router.post('/', createAlbumRules, store)

/**
 * PATCH /resource/:resourceId
 */
router.patch('/:albumId', updatePhotoRules, update)

/**
 * DELETE /resource/:resourceId
 */
router.delete('/:albumId', destroy)

export default router
