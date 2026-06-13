import app from "./app.js";
import { db } from "./config/db.js";
import "./config/qdrant.js";

// Connect to MongoDB
db();

// Export Express app for Vercel Serverless Function handler
export default app;
