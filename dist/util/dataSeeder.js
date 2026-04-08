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
exports.seed = seed;
exports.deleteAllData = deleteAllData;
exports.seedData = seedData;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_flow_1 = __importDefault(require("dotenv-flow"));
const faker_1 = require("@faker-js/faker");
// Project import
const bookModel_1 = require("../models/bookModel");
const userModel_1 = require("../models/userModel");
const database_1 = require("../repository/database");
dotenv_flow_1.default.config();
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, database_1.connect)();
            yield deleteAllData();
            yield seedData();
            console.log("Seeding process completed successfully...");
            process.exit();
        }
        catch (err) {
            console.log("Error Seeding data." + err);
        }
        finally {
            yield (0, database_1.disconnect)();
        }
    });
}
function deleteAllData() {
    return __awaiter(this, void 0, void 0, function* () {
        yield bookModel_1.BookModel.deleteMany();
        yield userModel_1.userModel.deleteMany();
        console.log("Cleared data successfully...");
    });
}
function seedData() {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt(10);
        const passwordHash = yield bcrypt_1.default.hash("12345678", salt);
        const user1 = new userModel_1.userModel();
        user1.name = faker_1.faker.person.fullName();
        user1.email = faker_1.faker.internet.email();
        user1.password = passwordHash;
        yield user1.save();
        const user2 = new userModel_1.userModel();
        user2.name = faker_1.faker.person.fullName();
        user2.email = faker_1.faker.internet.email();
        user2.password = passwordHash;
        yield user2.save();
        // Generate fake books using faker.book module (requires faker >= 9.1)
        for (let i = 0; i < 20; i++) {
            yield new bookModel_1.BookModel({
                title: faker_1.faker.book.title(), // real book titles
                author: faker_1.faker.book.author(), // real author names
                image: `https://picsum.photos/seed/${faker_1.faker.string.alphanumeric(6)}/300/450`,
                price: parseFloat(faker_1.faker.commerce.price({ min: 8, max: 35 })),
                genre: faker_1.faker.book.genre(), // real book genres
                publishedYear: faker_1.faker.date.past({ years: 50 }).getFullYear(),
                pages: faker_1.faker.number.int({ min: 80, max: 900 }),
                summary: faker_1.faker.lorem.paragraph(),
                available: faker_1.faker.datatype.boolean({ probability: 0.8 }),
                _createdBy: user1.id
            }).save();
        }
        console.log("Seeded data successfully...");
    });
}
seed();
//# sourceMappingURL=dataSeeder.js.map