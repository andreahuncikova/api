import mongoose from "mongoose";



export async function testConnection() {
    try {
        await connect();
        await disconnect();
        console.log("Databse connection test successful (connected and disconnected)");
    }
    catch (error) {
        console.error("Database connection test failed:", error);
    }
}

export async function connect() {
    try {
        if (!process.env.DBHOST) {
            throw new Error("DBHOST is not defined in environment variables");
        }
        await mongoose.connect(process.env.DBHOST);

        if (mongoose.connection.db) {
            await mongoose.connection.db.admin().command({ ping: 1 });
            console.log("Connected to the database successfully");
    }
    else {
        throw new Error("Database connection failed");
        }
    }

    catch (error) {
        console.error("Database connection error:", error);
    }
}


export async function disconnect() {
    try {
        await mongoose.disconnect();
        console.log("Disconnected from the database successfully");
    } catch (error) {
        console.error("Database disconnection error:", error);
    }
}