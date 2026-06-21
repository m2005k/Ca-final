import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authrouter from "./api/routes/auth.routes.js";
import organizationRouter from "./api/routes/organization.routes.js";
import frameworkRouter from "./api/routes/framework.route.js";
import productRoute from "./api/routes/product.routes.js";
import complianceRoute from "./api/routes/compliance.routes.js";
import cors from "cors";
dotenv.config();
const app = express();

app.set("trust proxy", 1); // Trust first proxy for secure cookies on Vercel

//  cors:
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        process.env.FRONTEND_URL
      ].filter(Boolean);

      // Allow if origin is in the list, is localhost, or is any Vercel deployment
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);
//  middleware:
app.use(express.json());
app.use(cookieParser());

//  routes
app.get("/", (req, res) => {
  res.json({ message: "Compliance Analysis API is running" });
});

app.use("/api/auth", authrouter);
app.use("/api/organization", organizationRouter);
app.use("/api/framework", frameworkRouter);
app.use("/api/product", productRoute);
app.use("/api/compliance", complianceRoute);

export default app;
