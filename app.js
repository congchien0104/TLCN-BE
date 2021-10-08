import express from "express";
import dotenv from "dotenv";

import bodyParser from "body-parser";
import cors from "cors";

// import publicRoutes from "./src/routes/public";
// import apiRoutes from "./src/routes/api";
// import adminRoutes from "./src/routes/admin";
// import apiMiddleware from "./src/middleware/apiAuth";
// import adminMiddleware from "./src/middleware/adminAuth";
// import errorHandler from "./src/middleware/errorHandler";

//const userRoutes = require("./src/routes/user");
const authRoute = require("./src/routes/auth.route");
const userRoute = require("./src/routes/user.route");
const userMiddleware = require("./src/middleware/authJwt");

dotenv.config();
require("./src/config/sequelize");

const app = express();
var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to congchien application." });
});

app.use("/auth", authRoute);
//app.use("/user", userRoutes);
app.use("/user", userMiddleware.verifyToken, userRoute);

// app.use('/pub', publicRoutes);
// app.use('/api', apiMiddleware, apiRoutes);
// app.use('/api/admin', apiMiddleware, adminMiddleware, adminRoutes);
// app.use(errorHandler);

module.exports = app;
