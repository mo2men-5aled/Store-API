require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");

const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

//middleware
app.use(express.json());
app.use(errorHandler);

//routes
app.use("/api/v1/products", productsRouter);
app.get("/", (req, res) => {
  res.send("<h1>Store API</h1><a href='/api/v1/products'>Products Route</a>");
});

//products route
app.use(notFound);

const port = 4000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`server is listining on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
