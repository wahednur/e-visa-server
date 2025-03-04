require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;

// App declare
const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send(`<h1>Server is running on ${port} Port</h1>`);
});

app.listen(port, () => {
  console.log(`Server is running on ${port} Port`);
});
