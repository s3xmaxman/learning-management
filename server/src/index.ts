import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import * as dynamoose from "dynamoose";
import {
  clerkMiddleware,
  createClerkClient,
  requireAuth,
} from "@clerk/express";

// Route imports
import courseRoutes from "./routes/courseRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import userClerkRoutes from "./routes/userClerkRoutes";
import userCourseProgressRoutes from "./routes/userCourseProgressRoutes";

// Configuration
dotenv.config();

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  dynamoose.aws.ddb.local();
}

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/courses", courseRoutes);
app.use("/users/clerk", requireAuth(), userClerkRoutes);
app.use("/transactions", requireAuth(), transactionRoutes);
app.use("/users/course-progress", requireAuth(), userCourseProgressRoutes);

// Server
const port = process.env.PORT || 3000;

if (!isProduction) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
