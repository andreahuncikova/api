import bcrypt from "bcrypt";
import dotenvFlow from "dotenv-flow";
import { faker } from '@faker-js/faker';

// Project import
import { BookModel } from "../models/bookModel";
import { userModel } from "../models/userModel";
import { connect, disconnect } from "../repository/database";

dotenvFlow.config();

export async function seed() {
  try {
    await connect();
    await deleteAllData();
    await seedData();
    console.log("Seeding process completed successfully...");
    process.exit();
  } catch (err) {
    console.log("Error Seeding data." + err);
  } finally {
    await disconnect();
  }
}

export async function deleteAllData() {
  await BookModel.deleteMany();
  await userModel.deleteMany();
  console.log("Cleared data successfully...");
}

export async function seedData() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("12345678", salt);

  const user1 = new userModel();
  user1.name = faker.person.fullName();
  user1.email = faker.internet.email();
  user1.password = passwordHash;
  await user1.save();

  const user2 = new userModel();
  user2.name = faker.person.fullName();
  user2.email = faker.internet.email();
  user2.password = passwordHash;
  await user2.save();

  // Generate fake books using faker.book module (requires faker >= 9.1)
  for (let i = 0; i < 20; i++) {
    await new BookModel({
      title: faker.book.title(),           // real book titles
      author: faker.book.author(),         // real author names
      image: `https://picsum.photos/seed/${faker.string.alphanumeric(6)}/300/450`,
      price: parseFloat(faker.commerce.price({ min: 8, max: 35 })),
      genre: faker.book.genre(),           // real book genres
      publishedYear: faker.date.past({ years: 50 }).getFullYear(),
      pages: faker.number.int({ min: 80, max: 900 }),
      summary: faker.lorem.paragraph(),
      available: faker.datatype.boolean({ probability: 0.8 }),
      _createdBy: user1.id
    }).save();
  }

  console.log("Seeded data successfully...");
}

seed();