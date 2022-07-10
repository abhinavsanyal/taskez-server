const express = require("express");
const router = express.Router();
const CardsController = require("./controllers/cards.controller");
const AuthMiddleware = require("../auth/middlewares/auth.middleware");

// get all cards
router.get("/", [AuthMiddleware.validJWTNeeded, CardsController.list]);

// create a new card
router.post("/", [AuthMiddleware.validJWTNeeded, CardsController.insert]);

// move the card to a different lane by id
router.post("/move", [AuthMiddleware.validJWTNeeded, CardsController.moveById]);

// get a card by id
router.get("/:id", [AuthMiddleware.validJWTNeeded, CardsController.getById]);

// update a card by id
router.post("/update", [AuthMiddleware.validJWTNeeded, CardsController.updateById]);

// delete a card by id
router.delete("/:id", [AuthMiddleware.validJWTNeeded,CardsController.removeById]);

// seed cards in database : public api
router.post("/seed", [
  CardsController.seed
]);

module.exports = router;
