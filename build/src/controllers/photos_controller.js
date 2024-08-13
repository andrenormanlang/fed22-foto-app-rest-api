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
exports.destroy = exports.update = exports.store = exports.show = exports.index = void 0;
/**
 *
 * Photos Controller
 */
const debug_1 = __importDefault(require("debug"));
const express_validator_1 = require("express-validator");
const photo_service_1 = require("../services/photo_service");
const http_errors_1 = require("http-errors");
// Create a new debug instance
const debug = (0, debug_1.default)('prisma-foto-api:photos_controller');
/**
 * Get all photos
 */
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = Number(req.token.sub);
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array()
        });
    }
    try {
        const photos = yield (0, photo_service_1.getPhotos)(user_id);
        res.send({
            status: "success",
            data: photos,
        });
    }
    catch (err) {
        console.log("Error thrown when finding photos with id %o: %o", err);
        res.status(500).send({ status: "error", message: "Something went wrong" });
    }
});
exports.index = index;
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const photoId = Number(req.params.photoId);
    const user_id = Number(req.token.sub);
    try {
        const photo = yield (0, photo_service_1.getPhoto)(photoId);
        if (!photo) {
            return res.status(404).send({
                status: "fail",
                message: "Photo not found"
            });
        }
        if (photo.user_id !== user_id) {
            return res.status(403).send({
                status: "fail",
                message: "Not authorized to access this photo"
            });
        }
        return res.status(200).send({
            status: "success",
            data: {
                id: photo.id,
                title: photo.title,
                url: photo.url,
                comment: photo.comment
            }
        });
    }
    catch (err) {
        debug("Error thrown when finding photo with id %o: %o", req.params.photoId, err);
        return res.status(500).send({
            status: 'error',
            message: 'Could not get the photo'
        });
    }
});
exports.show = show;
/**
 * Create a photo
 */
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array()
        });
    }
    const { title, url, comment } = req.body;
    try {
        const photo = yield (0, photo_service_1.createPhoto)({
            title,
            url,
            comment,
            user_id: Number(req.token.sub),
        });
        res.status(201).send({
            status: "success",
            data: photo,
        });
    }
    catch (err) {
        res.status(500).send({
            status: "error",
            message: "Could not create photo in database",
        });
    }
});
exports.store = store;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array()
        });
    }
    const photoId = Number(req.params.photoId);
    const user_id = Number(req.token.sub);
    try {
        const photo = yield (0, photo_service_1.updatePhoto)(photoId, req.body, user_id);
        return res.status(200).send({
            status: "success",
            data: {
                id: photo.id,
                title: photo.title,
                url: photo.url,
                comment: photo.comment,
                user_id: user_id,
            },
        });
    }
    catch (err) {
        if (err instanceof http_errors_1.HttpError) {
            return res.status(err.statusCode).send({
                status: "error",
                message: err.message,
            });
        }
        else {
            return res.status(500);
        }
    }
});
exports.update = update;
/**
 * Delete a photo
 */
const destroy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array()
        });
    }
    const photoId = Number(req.params.photoId);
    const user_id = Number(req.token.sub);
    try {
        const photo = yield (0, photo_service_1.deletePhoto)(photoId, user_id);
        return res.status(200).send({
            status: "success",
            data: null,
        });
    }
    catch (err) {
        if (err instanceof http_errors_1.HttpError) {
            return res.status(err.statusCode).send({
                status: "error",
                message: err.message,
            });
        }
        else {
            return res.status(500);
        }
    }
});
exports.destroy = destroy;
