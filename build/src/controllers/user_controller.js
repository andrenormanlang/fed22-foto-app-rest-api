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
exports.refresh = exports.register = exports.login = void 0;
/**
 * Controller Template
 */
const bcrypt_1 = __importDefault(require("bcrypt"));
const debug_1 = __importDefault(require("debug"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = require("../services/user_service");
// Create a new debug instance
const debug = (0, debug_1.default)('photo-album-api:user_controller');
/**
 * Login a user
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_service_1.getUserByEmail)(req.body.email);
    if (!user) {
        return res.status(401).send({
            status: "fail",
            message: "Authorization required",
        });
    }
    const { email, first_name, last_name } = user;
    const passwordComparison = yield bcrypt_1.default.compare(req.body.password, user.password);
    if (!passwordComparison) {
        return res.status(401).send({
            status: "fail",
            message: "Authorization required",
        });
    }
    const payload = {
        sub: user.id,
        email,
        first_name,
        last_name,
    };
    const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFETIME } = process.env;
    if (!ACCESS_TOKEN_SECRET) {
        return res.status(401).send({
            status: "fail",
            message: "no ACCESS_TOKEN_SECRET defined",
        });
    }
    const access_token = jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_LIFETIME || '4h'
    });
    if (!REFRESH_TOKEN_SECRET) {
        return res.status(401).send({
            status: "fail",
            message: "no REFRESH_TOKEN_SECRET defined",
        });
    }
    const refresh_token = jsonwebtoken_1.default.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_LIFETIME || '1d'
    });
    res.send({
        status: "success",
        data: {
            access_token,
            refresh_token,
        }
    });
});
exports.login = login;
/**
 * Register a user
 */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array()
        });
    }
    const validatedData = (0, express_validator_1.matchedData)(req);
    const hashedPassword = yield bcrypt_1.default.hash(validatedData.password, process.env.SALT_ROUNDS || 10);
    validatedData.password = hashedPassword;
    const { email, password, first_name, last_name } = validatedData;
    console.log(validatedData);
    try {
        yield (0, user_service_1.createUser)({
            email,
            password,
            first_name,
            last_name,
        });
        res.status(201).send({
            status: "success",
            data: {
                email,
                first_name,
                last_name,
            },
        });
    }
    catch (err) {
        res.status(500).send({
            status: "error",
            message: "Could not create user in database",
        });
    }
});
exports.register = register;
/**
 * Refresh access_token
 */
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        return res.status(401).send({
            status: "fail",
            message: "Authorization required",
        });
    }
    const [authSchema, token] = req.headers.authorization.split(' ');
    if (authSchema.toLocaleLowerCase() !== 'bearer') {
        return res.status(401).send({
            status: "fail",
            message: "Authorization required",
        });
    }
    try {
        const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_SECRET } = process.env;
        const refresh_payload = jsonwebtoken_1.default.verify(token, REFRESH_TOKEN_SECRET || "");
        const { sub, email, first_name, last_name } = refresh_payload;
        const payload = {
            sub,
            email,
            first_name,
            last_name,
        };
        if (!ACCESS_TOKEN_SECRET) {
            debug("No ACCESS_TOKEN_SECRET defined");
            return res.status(500).send({
                status: "error",
                data: "No ACCESS_TOKEN_SECRET defined",
            });
        }
        const access_token = jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_LIFETIME || '4h',
        });
        res.send({
            status: "success",
            data: {
                access_token,
            }
        });
    }
    catch (err) {
        return res.status(401).send({
            status: "fail",
            message: "Authorization required",
        });
    }
});
exports.refresh = refresh;
