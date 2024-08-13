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
exports.refresh = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const debug_1 = __importDefault(require("debug"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = require("../services/user_service");
const debug = (0, debug_1.default)('api: 🧔‍♀️ user_controller');
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).send({
            status: 'fail',
            data: validationErrors.array()
        });
    }
    const validData = (0, express_validator_1.matchedData)(req);
    const hashedPassword = yield bcrypt_1.default.hash(validData.password, Number(process.env.SALT_ROUNDS) || 10);
    validData.password = hashedPassword;
    try {
        const user = yield (0, user_service_1.createUser)({
            email: validData.email,
            password: validData.password,
            first_name: validData.first_name,
            last_name: validData.last_name
        });
        res.status(201).send({
            status: 'success',
            data: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name
            }
        });
    }
    catch (err) {
        return res.status(500).send({
            status: 'error',
            message: "Couldn't create user in database"
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield (0, user_service_1.getUserByEmail)(email);
    if (!user) {
        return res.status(401).send({
            status: 'fail',
            message: "Authorization required"
        });
    }
    const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(401).send({
            status: 'fail',
            message: "Authorization required"
        });
    }
    const payload = {
        sub: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
    };
    if (!process.env.ACCESS_TOKEN_SECRET) {
        return res.status(500).send({
            status: 'error',
            message: "No access token secret defined"
        });
    }
    const access_token = jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '4h'
    });
    if (!process.env.REFRESH_TOKEN_SECRET) {
        return res.status(500).send({
            status: 'error',
            message: "No refresh token secret defined"
        });
    }
    const refresh_token = jsonwebtoken_1.default.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME || '1d'
    });
    res.send({
        status: 'success',
        data: {
            access_token,
            refresh_token
        }
    });
});
exports.login = login;
const refresh = (req, res) => {
    if (!req.headers.authorization) {
        debug("Authorization header missing");
        return res.status(401).send({
            status: 'fail',
            data: "Authorization required"
        });
    }
    const [authSchema, token] = req.headers.authorization.split(' ');
    if (authSchema.toLowerCase() !== "bearer") {
        debug("Authorization schema isn't Bearer");
        return res.status(401).send({
            status: 'fail',
            data: "Authorization required"
        });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET || '');
        delete payload.iat;
        delete payload.exp;
        if (!process.env.ACCESS_TOKEN_SECRET) {
            return res.status(500).send({
                status: 'error',
                message: "No access token secret defined"
            });
        }
        const access_token = jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '4h'
        });
        res.send({
            status: 'success',
            data: {
                access_token
            }
        });
    }
    catch (err) {
        debug("Token failed verification", err);
        return res.status(401).send({
            status: 'fail',
            data: "Authorization required"
        });
    }
};
exports.refresh = refresh;
