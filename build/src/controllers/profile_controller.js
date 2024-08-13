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
exports.updateProfile = exports.getProfile = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const debug_1 = __importDefault(require("debug"));
const express_validator_1 = require("express-validator"); //matchedData is another function of express-validator
const user_service_1 = require("../services/user_service");
const debug = (0, debug_1.default)("prisma-books:profile_controller");
/**
 * Get the authenticated user´s profile
 */
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // User has authenticated sucessfully
    const profile = yield (0, user_service_1.getUserByEmail)(req.token.email);
    //WHO DIS?!
    res.send({
        status: "success",
        data: {
            id: profile === null || profile === void 0 ? void 0 : profile.id,
            email: profile === null || profile === void 0 ? void 0 : profile.email,
            first_name: profile === null || profile === void 0 ? void 0 : profile.first_name,
            last_name: profile === null || profile === void 0 ? void 0 : profile.last_name,
        },
    });
});
exports.getProfile = getProfile;
/**
 * Update the authenticated user´s profile
 */
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for any validation errors
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array(),
        });
    }
    // Get ONLY the validated data from the request
    const validatedData = (0, express_validator_1.matchedData)(req);
    // If user wants to update password, hash and salt it
    if (validatedData.password) {
        const hashedPassword = yield bcrypt_1.default.hash(validatedData.password, Number(process.env.
            SALT_ROUNDS) || 10);
        console.log("Hashed password:", hashedPassword);
        // Replace password with hashed password
        validatedData.password = hashedPassword;
    }
    try {
        // updateUser(validatedData)
        const userData = yield (0, user_service_1.updateUser)(req.token.sub, validatedData);
        res.send({ status: "success", data: userData });
    }
    catch (_a) {
        return res.status(500).send({
            status: "fail",
            message: "Could not update profile in database"
        });
    }
    //res.send(validatedData) // if you use (req.body) will get the whole data and not only the validations
});
exports.updateProfile = updateProfile;
