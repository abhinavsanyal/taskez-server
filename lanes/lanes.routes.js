const express = require("express");
const router = express.Router();
const LanesController = require("./controllers/lanes.controller");


router.get("/", [LanesController.list]);

// public route to seed db with 3 lanes
router.get("/seed", [
  LanesController.seed
]);

module.exports = router;
