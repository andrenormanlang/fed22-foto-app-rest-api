/* Profile Router */
import express from 'express'
import { getProfile, updateProfile } from '../controllers/profile_controller'
import { updateUserRules } from '../validations/user_rules'
const router = express.Router()

/**
*GET /profile
*/
router.get('/', getProfile)

/**
*PATCH /profile
*/
router.patch('/', updateProfile)

export default router
