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
 * Controller Template
 */
const debug_1 = __importDefault(require("debug"));
// Create a new debug instance
const debug = (0, debug_1.default)('prisma-boilerplate:I_AM_LAZY_AND_HAVE_NOT_CHANGED_THIS_😛');
/**
 * Get all resources
 */
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.index = index;
/**
 * Get a single resource
 */
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.show = show;
/**
 * Create a resource
 */
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.store = store;
/**
 * Update a resource
 */
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.update = update;
/**
 * Delete a resource
 */
const destroy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.destroy = destroy;
