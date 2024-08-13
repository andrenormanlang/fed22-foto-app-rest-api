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
/**
 * Example Seeder
 */
const prisma_1 = __importDefault(require("../src/prisma"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * Publishers
         */
        // const hutchinson = await prisma.publisher.upsert({
        // 	where: { id: 1 },
        // 	update: {},
        // 	create: { id: 1, name: "Hutchinson" }
        // })
        /**
         * Authors
         */
        // const clarke = await prisma.author.upsert({
        // 	where: { id: 1 },
        // 	update: {},
        // 	create: { name: "Sir Arthur C. Clarke" }
        // })
        /**
         * Books
         */
        // const odessey = await prisma.book.upsert({
        // 	where: { id: 1 },
        // 	update: {},
        // 	create: {
        // 		title: "2001: A Space Odessey",
        // 		pages: 224,
        // 		publisherId: hutchinson.id,
        // 		authors: {
        // 			connect: [
        // 				{ id: clarke.id },
        // 			],
        // 		}
        // 	}
        // })
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma_1.default.$disconnect();
    process.exit(1);
}));
