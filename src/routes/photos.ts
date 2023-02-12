/**
 * Router Template
 */
import express from 'express'
import { index, show, store, update, destroy } from '../controllers/photos_controller'


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
router.post('/', store)

/**
 * PATCH /resource/:resourceId
 */
router.patch('/:photoId', [], update)

/**
 * DELETE /resource/:resourceId
 */
router.delete('/:photoId', destroy)

export default router
