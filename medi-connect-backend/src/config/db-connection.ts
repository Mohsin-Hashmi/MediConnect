import mongoose from "mongoose";

export const connectToDatabase = async () => {
    try {
        const connectionString = process.env.DB_CONNECTION_STRING;
        if (!connectionString) {
            throw new Error("Database connection string is not defined in the environment variables.");
        }
        await mongoose.connect(connectionString);
    }catch (error) {
        console.error("Error connecting to the database and starting the server:", error);
        throw error;
    }
}