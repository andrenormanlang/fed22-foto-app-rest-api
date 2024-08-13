"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAlbum = exports.updateAlbum = exports.getAlbumUser = exports.removePhotoFromAlbum = exports.addPhotos = exports.getAlbum = exports.getAlbums = exports.createAlbum = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const http_errors_1 = require("http-errors");
/**
 * Create a Album
 *
 * @param data Album Details with title only
 */
const createAlbum = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.album.create({ data });
});
exports.createAlbum = createAlbum;
/**
 * Get all albums
 */
const getAlbums = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.album.findMany({
        where: {
            user_id: user_id
        }
    });
});
exports.getAlbums = getAlbums;
/**
 * Get a single Album
 *
 * @param albumId The id of the album to get
 */
const getAlbum = (albumId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.album.findUnique({
        where: {
            id: albumId,
        },
        include: {
            photos: true
        }
    });
});
exports.getAlbum = getAlbum;
/**
 * Add multiple photos to a Album
 *
 * @param data Album Details
 */
const addPhotos = (albumId, photoIds, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const album = yield prisma_1.default.album.findUnique({ where: { id: albumId } });
    if (!album) {
        throw new http_errors_1.NotFound('Album not found');
    }
    if (album.user_id !== user_id) {
        throw new http_errors_1.Forbidden('Not authorized to access this album');
    }
    const photos = yield prisma_1.default.photo.findMany({
        where: { id: { in: photoIds } }
    });
    if (photos.length !== photoIds.length) {
        const existingPhotoIds = photos.map((photo) => photo.id);
        const nonExistingPhotoIds = photoIds.filter((id) => !existingPhotoIds.includes(id));
        throw new http_errors_1.Forbidden(`The following photoIds do not exist: ${nonExistingPhotoIds.join(', ')}`);
    }
    const userIds = photos.map((photo) => photo.user_id);
    if (userIds.some((id) => id !== user_id)) {
        throw new http_errors_1.Forbidden('You do not have permission to add some of the photos to the album');
    }
    yield prisma_1.default.album.update({
        where: { id: albumId },
        data: {
            photos: {
                connect: photoIds.map((id) => ({ id }))
            }
        },
        include: { photos: true }
    });
});
exports.addPhotos = addPhotos;
/**
 * Remove a photo from a Album but not the photo itself
 *
 * @param data Album Details
 */
const removePhotoFromAlbum = (albumId, photoId) => __awaiter(void 0, void 0, void 0, function* () {
    const album = yield prisma_1.default.album.findUnique({
        where: { id: albumId },
        select: { photos: true },
    });
    if (!album) {
        throw (0, http_errors_1.NotFound)('Album not found');
    }
    const photo = album.photos.find((p) => p.id === photoId);
    if (!photo) {
        throw (0, http_errors_1.NotFound)('Photo not found');
    }
    yield prisma_1.default.album.update({
        where: { id: albumId },
        data: {
            photos: {
                disconnect: { id: photoId },
            },
        },
    });
});
exports.removePhotoFromAlbum = removePhotoFromAlbum;
const getAlbumUser = (albumId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.album.findUnique({
        where: { id: albumId },
        include: { user: true },
    });
});
exports.getAlbumUser = getAlbumUser;
/**
 * Update a album
 *
 * @param data Photo Details
 */
const updateAlbum = (albumId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.album.update({
        where: {
            id: albumId,
        },
        data: userData,
    });
});
exports.updateAlbum = updateAlbum;
/**
 * Delete a Album
 *
 * @param data Album Details
 */
const deleteAlbum = (albumId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.album.delete({
        where: { id: albumId },
    });
});
exports.deleteAlbum = deleteAlbum;
