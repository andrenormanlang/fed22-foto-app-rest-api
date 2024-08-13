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
exports.updateUserRules = exports.createLoginRules = exports.createUserRules = exports.getUserByEmail = void 0;
/**
 * Validation Rules for User resource
 */
const express_validator_1 = require("express-validator");
// problemas nessa importacao
const prisma_1 = __importDefault(require("../prisma"));
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.findUnique({
        where: {
            email: email,
        }
    });
});
exports.getUserByEmail = getUserByEmail;
exports.createUserRules = [
    (0, express_validator_1.body)("email").isEmail().withMessage("This email is not valid").
        custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        // check if a User with that email already exists
        const user = yield (0, exports.getUserByEmail)(value);
        if (user) {
            //if the user already exists respond to the user
            return Promise.reject("Email already exists");
        }
    })),
    (0, express_validator_1.body)("password").isString().bail().isLength({ min: 6 }).
        withMessage("Password must be at least 6 characters long"),
    (0, express_validator_1.body)("first_name").isString().bail().isLength({ min: 3 }).
        withMessage("First name must be at least 3 characters long"),
    (0, express_validator_1.body)("last_name").isString().bail().isLength({ min: 3 }).
        withMessage("Last name must be at least 3 characters long")
];
exports.createLoginRules = [
    (0, express_validator_1.body)("email").isEmail().
        withMessage('This is not a valid email').
        custom(function login(email) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if a user with the given email exists
            const user = yield prisma_1.default.user.findUnique({
                where: {
                    email,
                },
            });
            if (!user) {
                throw new Error('Invalid email or password');
            }
        });
    }).
        withMessage('This email does not exist'),
    (0, express_validator_1.body)("password").isString().bail().isLength({ min: 6 }).
        withMessage('Your password must be at least 6 characters long')
];
exports.updateUserRules = [
    (0, express_validator_1.body)('name').optional().isString().bail().isLength({ min: 3 }),
    (0, express_validator_1.body)('email').optional().isEmail().custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        // check if a User with that email already exists
        const user = yield (0, exports.getUserByEmail)(value);
        if (user) {
            // user already exists, throw a hissy-fit
            return Promise.reject("Email already exists");
        }
    })),
    (0, express_validator_1.body)('password').optional().isString().bail().isLength({ min: 6 }),
];
