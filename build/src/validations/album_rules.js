"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAlbumRules = exports.createAlbumRules = void 0;
/**
 * Validation Rules for User resource
 */
const express_validator_1 = require("express-validator");
exports.createAlbumRules = [
    (0, express_validator_1.body)("title").isString().bail().isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),
];
exports.updateAlbumRules = [
    (0, express_validator_1.body)("title").isString().bail().isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),
];
