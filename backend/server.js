const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Cors Middleware
app.use(cors());

// Bodyparser Middleware
app.use(express.json());

// Connect to Mongo
mongoose
  //.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .connect(
    process.env.MONGODB_CONNECTION,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    (err) => {
      if (err) throw err;
      console.log("MongoDB Connected...");
    }
  );

// Use Routes
app.use("/users", require("./routes/users"));
//app.use("/api/items", require("./routes/items"));
app.use("/projects", require("./routes/projects"));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Connected to port: ${port}`);
});
