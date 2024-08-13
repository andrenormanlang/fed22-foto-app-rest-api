"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Router Template
 */
const express_1 = __importDefault(require("express"));
const photos_controller_1 = require("../controllers/photos_controller");
const photo_rules_1 = require("../validations/photo_rules");
const router = express_1.default.Router();
/**
 * GET /resource
 */
router.get('/', photos_controller_1.index);
/**
 * GET /resource/:resourceId
 */
router.get('/:photoId', photos_controller_1.show);
/**
 * POST /resource
 */
router.post('/', photo_rules_1.createPhotoRules, photos_controller_1.store);
/**
 * PATCH /resource/:resourceId
 */
router.patch('/:photoId', photo_rules_1.updatePhotoRules, photos_controller_1.update);
/**
 * DELETE /resource/:resourceId
 */
router.delete('/:photoId', photos_controller_1.destroy);
exports.default = router;
