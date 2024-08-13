"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Profile Router */
const express_1 = __importDefault(require("express"));
const profile_controller_1 = require("../controllers/profile_controller");
const router = express_1.default.Router();
/**
*GET /profile
*/
router.get('/', profile_controller_1.getProfile);
/**
*PATCH /profile
*/
router.patch('/', profile_controller_1.updateProfile);
exports.default = router;
