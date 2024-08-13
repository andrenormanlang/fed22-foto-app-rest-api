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
const prisma_1 = __importDefault(require("../prisma"));
const user_service_1 = require("../services/user_service");
// Create a new debug instance
const debug = (0, debug_1.default)("prisma-foto-api:jwt");
//Login as user
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // destructure email and password from request body
    const { email, password } = req.body;
    //find user email, otherwise bail 🛑
    const user = yield (0, user_service_1.getUserByEmail)(email);
    if (!user) {
        return res.status(401).send({
            status: "fail",
            message: "Authorization required",
        });
    }
    // verify hash agains credentials, otherwise bail 🛑
    const result = yield bcrypt_1.default.compare(password, user.password);
    if (!result) {
        return res.status(401).send({
            status: "fail",
            message: "Authorization required",
        });
    }
    //construct jwt-payload
    const payload = {
        sub: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
    };
    // sign payload with secret and get access token
    if (!process.env.ACCESS_TOKEN_SECRET) {
        return res.status(500).send({
            status: "error",
            message: "No access token secret defined",
        });
    }
    const access_token = jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME || "4h",
    });
    // sign payload with refresh-token secret and get refresh-token
    if (!process.env.REFRESH_TOKEN_SECRET) {
        return res.status(500).send({
            status: "error",
            message: "No refresh token secret defined",
        });
    }
    const refresh_token = jsonwebtoken_1.default.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME || "1d",
    });
    // respond with access- and refresh-token
    res.send({
        status: "success",
        data: {
            access_token,
            refresh_token,
        },
    });
});
exports.login = login;
/**
 * Register a new user
 */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for any validation errors
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).send({
            status: "fail",
            data: validationErrors.array(),
        });
    }
    //Check if a user with the incoming email already exists (other way of doing the handling)
    //const user = await prisma.user.findUnique()
    // Get only the validated data from the request
    const validatedData = (0, express_validator_1.matchedData)(req);
    console.log("validatedData:", validatedData);
    // Calculate a hash + salt for the password
    const hashedPassword = yield bcrypt_1.default.hash(validatedData.password, Number(process.env.SALT_ROUNDS) || 10);
    console.log("Hashed password:", hashedPassword);
    // Replace password with hashed password
    validatedData.password = hashedPassword;
    // Store the user in the database
    try {
        const user = yield prisma_1.default.user.create({
            data: {
                email: validatedData.email,
                password: validatedData.password,
                first_name: validatedData.first_name,
                last_name: validatedData.last_name,
            },
        });
        // Respond with 201 Created + status success
        res.status(201).send({
            status: "success",
            data: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            },
        });
    }
    catch (err) {
        return res
            .status(500)
            .send({ status: "error", message: "Could not create user in database" });
    }
});
exports.register = register;
/**
 * Refresh token
 *
 * Receives as refresh token and issues	a new access token
 *
 * Authorization: Bearer <refresh-token>
 */
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Make sure authorization header exists
    debug(req.headers);
    if (!req.headers.authorization) {
        debug("Authorization header missing");
        return res.status(401).send({
            status: "fail",
            data: "Authorization required",
        });
    }
    // Split authorization header on ' '
    const [authSchema, token] = req.headers.authorization.split(" ");
    // Make sure Authorization schema is "Bearer"
    if (authSchema.toLowerCase() !== "bearer") {
        debug("Authorization schema isn't Bearer");
        return res.status(401).send({
            status: "fail",
            data: "Authorization required",
        });
    }
    // Verify refresh token and get refresh token payload
    try {
        // Verify refresh token using the refresh token secret
        //const {sub,name,email} = (jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || "") as unknown) as JwtPayload
        const payload = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET || "");
        // Construct access token payload
        // const payload: JwtPayload = {
        //     sub, //users id // sub = subject the token is issued for
        // 	   name,
        //     email,
        // }
        // Remove 'iat' and 'exp' from refresh token payload
        delete payload.exp;
        delete payload.iat;
        // Issue a new access token
        if (!process.env.ACCESS_TOKEN_SECRET) {
            return res.status(500).send({
                status: "error",
                message: "No access token secret defined",
            });
        }
        const access_token = jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_LIFETIME || "4h",
        });
        //
        //Respond with new access token
        res.send({
            status: "success",
            data: {
                access_token, // access_token: access_token
            },
        });
    }
    catch (err) {
        debug("Refresh token failed verification", err);
        //return res.jsend.fail("") //Possibly works with express or typescript but not sure
        return res.status(401).send({
            status: "fail",
            data: "Authorization required",
        });
    }
});
exports.refresh = refresh;
