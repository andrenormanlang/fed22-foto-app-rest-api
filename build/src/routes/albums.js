"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Router Template
 */
const express_1 = __importDefault(require("express"));
const albums_controller_1 = require("../controllers/albums_controller");
const album_rules_1 = require("../validations/album_rules");
const router = express_1.default.Router();
/**
 * GET / albums
 */
router.get('/', albums_controller_1.index);
/**
 * GET /albums/:albumId
 */
router.get('/:albumId', albums_controller_1.show);
/**
 * POST /photos
 */
router.post('/', album_rules_1.createAlbumRules, albums_controller_1.store);
/**
 * POST /add a photo to an album // blocked for now
 */
// router.post('/:albumId/photos', addPhotoToAlbum)
/**
 * POST /multiple photos to an album
 */
router.post('/:albumId/photos', albums_controller_1.addPhotosToAlbum);
/**
 * POST / delete a photo from an album
 */
router.delete('/:albumId/photos/:photoId', albums_controller_1.removePhoto);
/**
 * PATCH /albums/:resourceId
 */
router.patch('/:albumId', album_rules_1.updateAlbumRules, albums_controller_1.update);
/**
 * DELETE /resource/:resourceId
 */
router.delete('/:albumId', albums_controller_1.destroy);
exports.default = router;
