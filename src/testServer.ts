import { MongoMemoryServer } from 'mongodb-memory-server';
import { startServer } from './app';

async function startTestServer() {
    const mongod = await MongoMemoryServer.create();
    process.env.DBHOST = mongod.getUri();
    await startServer();
}

startTestServer();
