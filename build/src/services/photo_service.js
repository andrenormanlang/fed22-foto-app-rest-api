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
exports.deletePhoto = exports.updatePhoto = exports.createPhoto = exports.getPhoto = exports.getPhotos = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const http_errors_1 = require("http-errors");
/**
 * Get all photos
 */
const getPhotos = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.photo.findMany({
        where: {
            user_id: user_id
        },
        select: {
            id: true,
            title: true,
            url: true,
            comment: true
        }
    });
});
exports.getPhotos = getPhotos;
/**
 * Get a single photo
 *
 * @param photoId The id of the photo to get
 */
const getPhoto = (photoId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.photo.findUnique({
        where: {
            id: photoId,
        },
    });
});
exports.getPhoto = getPhoto;
/**
 * Create a photo
 *
 * @param data Photo Details
 */
const createPhoto = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.photo.create({ data });
});
exports.createPhoto = createPhoto;
/**
 * Update a photo
 *
 * @param data Photo Details
 */
const updatePhoto = (photoId, userData, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const photo = yield (0, exports.getPhoto)(photoId);
    if (!photo) {
        throw (0, http_errors_1.NotFound)('Photo not found');
    }
    if (photo.user_id !== user_id) {
        throw (0, http_errors_1.Forbidden)('Not authorized to access this photo');
    }
    return yield prisma_1.default.photo.update({
        where: {
            id: photoId,
        },
        data: userData,
    });
});
exports.updatePhoto = updatePhoto;
/**
 * Delete a photo
 *
 * @param data Photo Details
 */
const deletePhoto = (photoId, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const photo = yield (0, exports.getPhoto)(photoId);
    if (!photo) {
        throw (0, http_errors_1.NotFound)('Photo not found');
    }
    if (photo.user_id !== user_id) {
        throw (0, http_errors_1.Forbidden)('Not authorized to access this photo');
    }
    return yield prisma_1.default.photo.delete({
        where: {
            id: photoId,
        },
    });
});
exports.deletePhoto = deletePhoto;
