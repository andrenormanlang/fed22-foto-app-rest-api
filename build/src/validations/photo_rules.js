"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePhotoRules = exports.createPhotoRules = void 0;
/**
 * Validation Rules for User resource
 */
const express_validator_1 = require("express-validator");
exports.createPhotoRules = [
    (0, express_validator_1.body)("title").isString().bail().isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),
    (0, express_validator_1.body)("url").isString().isURL().withMessage("URL must be a valid URL"),
    (0, express_validator_1.body)("comment").isString().bail().isLength({ min: 3 }).withMessage("Comment must be at least 3 characters"),
];
exports.updatePhotoRules = [
    (0, express_validator_1.body)("title").optional().isString().bail().isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),
    (0, express_validator_1.body)("url").optional().isString().isURL().withMessage("URL must be a valid URL"),
    (0, express_validator_1.body)("comment").optional().isString().bail().isLength({ min: 3 }).withMessage("Comment must be at least 3 characters"),
];
