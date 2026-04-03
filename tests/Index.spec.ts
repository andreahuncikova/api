/// <reference types="node" />
// process.env.NODE_ENV = 'test';
import { test } from '@playwright/test';

// Test Collections
import healthTests from './Health.spec';
import devToolsTests from './Devtools.spec';
import authRegisterTests from './Auth.register.spec';
import authLoginTests from './Auth.login.spec';
import booksPublicTests from './Books.public.spec';
import booksProtectedTests from './Books.protected.spec';
import booksE2eTests from './Books.e2e.spec';

// Project imports
import { userModel } from "../src/models/userModel";
import { BookModel } from "../src/models/bookModel";
import { connect, disconnect } from '../src/repository/database';
import dotenvFlow from "dotenv-flow";
dotenvFlow.config();

function setup() {
    test.beforeAll(async () => {
            await connect();
            await userModel.deleteMany({});
            await BookModel.deleteMany({});
    });

    test.afterAll(async () => {
        try {
            await connect();
            await userModel.deleteMany({});
            await BookModel.deleteMany({});
        } finally {
            await disconnect();
        }
    });
}

setup();

// Run tests sequentially
test.describe(healthTests);
test.describe(devToolsTests);
test.describe(authRegisterTests);
test.describe(authLoginTests);
test.describe(booksPublicTests);
test.describe(booksProtectedTests);
test.describe(booksE2eTests);