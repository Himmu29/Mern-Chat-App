import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {connectDB} from "./lib/db.js"
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";

dotenv.config();

app.use(express.json({ limit: "10mb" }));  // or higher like 50mb if needed
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const PORT = process.env.PORT; 

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

if (process.env.NODE_ENV === "production") {
    const frontendBuildPath = path.resolve("../frontend/dist"); // relative to project root

    app.use(express.static(frontendBuildPath));

    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendBuildPath, "index.html"));
    });
}

server.listen(PORT,()=>{
    console.log("Server is running on port:" + PORT);
    connectDB();
})