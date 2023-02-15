/**
 * Router Template
 */
import express from 'express'
import { index, show, store, update, destroy } from '../controllers/photos_controller'
import { createPhotoRules, updatePhotoRules  } from '../validations/photo_rules'

const router = express.Router()

/**
 * GET /resource
 */
router.get('/', index)

/**
 * GET /resource/:resourceId
 */
router.get('/:photoId', show)

/**
 * POST /resource
 */
router.post('/', createPhotoRules, store)

/**
 * PATCH /resource/:resourceId
 */
router.patch('/:photoId', updatePhotoRules, update)

/**
 * DELETE /resource/:resourceId
 */
router.delete('/:photoId', destroy)

export default router
