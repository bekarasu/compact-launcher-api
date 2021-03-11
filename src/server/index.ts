import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { fileSystem } from "./config/filesystem";
import { adminApiRouter } from "./routes/admin/api";
import { adminWebRouter } from "./routes/admin/web";
import { appApiRouter } from "./routes/app/api";
import { appWebRouter } from "./routes/app/web";
dotenv.config();

if (process.env.PORT == null || isNaN(parseInt(process.env.PORT))) {
  throw new Error("Port Not Defined or Invalid");
}

const server = express();

// url definition
server.use(fileSystem.assetUrl, express.static(fileSystem.uploadPath)); // setting assets folder path
server.use(fileSystem.publicUrl, express.static(fileSystem.publicPath)); // setting assets url
server.use("/admin/api", adminApiRouter);
server.use("/admin", adminWebRouter);
server.use("/api", appApiRouter);
server.use("/*", appWebRouter);

// MongoDB Database connection
mongoose.connect("mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT + "/" + process.env.DB_DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
})
  .catch((err) => {
    console.log("DB Connection Error: " + err.message);
  });

const PORT: number = parseInt(process.env.PORT as string, 10);
server.listen(PORT);
if (process.env.NODE_ENV === "development")
  console.log("listening " + process.env.URL + ":" + PORT);

process.on('unhandledRejection', (reason, p) => {
  if (process.env.NODE_ENV === "development") {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  }
});
