"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const photos_1 = __importDefault(require("./photos"));
const albums_1 = __importDefault(require("./albums"));
const profile_1 = __importDefault(require("./profile"));
const user_controller_1 = require("../controllers/user_controller");
const user_rules_1 = require("../validations/user_rules");
const jwt_1 = require("../middlewares/auth/jwt");
// instantiate a new router
const router = express_1.default.Router();
/**
 * GET /
 */
router.get("/", (req, res) => {
    res.send({
        message: "I AM API, BEEP BOOP",
    });
});
/**
 * /register
 */
router.post("/register", user_rules_1.createUserRules, user_controller_1.register);
/**
 * POST /login
 */
router.post("/login", user_rules_1.createLoginRules, user_controller_1.login);
/**
 * POST /refresh
 */
//router.use('/profile', basic, profile)
router.use("/refresh", user_controller_1.refresh);
/**
 * photos
 */
router.use("/photos", jwt_1.validateToken, photos_1.default); //validate token
/**
 * photos
 */
router.use("/albums", jwt_1.validateToken, albums_1.default); //validate token
/**
 * /profile // for testing purposes only
 */
router.use("/profile", jwt_1.validateToken, profile_1.default); //validate token
exports.default = router;
