const express = require("express");
let cors = require('cors')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");


// We load the Models
require("./users//models/User");
require("./lanes//models/Lane");
require("./cards//models/Card");

const authRouter = require("./auth/auth.routes");
const usersRouter = require("./users/users.routes");
const lanesRouter = require("./lanes/lanes.routes");
const cardsRouter = require("./cards/cards.routes");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  } else {
    if (process.env.NODE_ENV != "test") {
      console.log(req.originalUrl);
    }
    return next();
  }
});
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = process.env.MONGO_URI;
if (process.env.NODE_ENV != "test") {
  // Connect to MongoDB
  mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));
}

// Passport middleware
app.use(passport.initialize());

// Passport config
// require("./config/passport")(passport);

// Routes
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/lanes", lanesRouter);
app.use("/api/cards", cardsRouter);


const port = process.env.PORT || 5000;

app.listen(port, () => {
  if (process.env.NODE_ENV != "test") {
    console.log(`Server up and running on port ${port} !`);
  }
});
