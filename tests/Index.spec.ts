/// <reference types="node" />
import { test } from '@playwright/test';

// Test Collections
import healthTests from './Health.spec';
import devToolsTests from './Devtools.spec';
import authRegisterTests from './Auth.register.spec';
import authLoginTests from './Auth.login.spec';
import booksPublicTests from './Books.public.spec';
import booksProtectedTests from './Books.protected.spec';
import booksE2eTests from './Books.e2e.spec';

// Run tests sequentially
test.describe(healthTests);
test.describe(devToolsTests);
test.describe(authRegisterTests);
test.describe(authLoginTests);
test.describe(booksPublicTests);
test.describe(booksProtectedTests);
test.describe(booksE2eTests);
