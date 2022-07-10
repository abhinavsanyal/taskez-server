const mongoose = require("mongoose");
let Card = mongoose.model("Card");
let User = mongoose.model("User");
let Lane = mongoose.model("Lane");

exports.insert = (req, res) => {
  // find the lane id in the request body and get the Lane and push the new Card to the lane
  Lane.findById(req.body.laneId)
    .then((lane) => {
      if (lane) {
        // try to find the card by id in req body . If not found then create a new card and push it to the lane
        Card.findById(req.body.id)
          .then((card) => {
            if (card) {
              return res.status(400).json({ card: "Card already exists" });
            } else {
              const newCard = {
                title: req.body.title,
                description: req.body.description,
                author: req.jwt.id,
                members: [req.jwt.id],
                lane: req.body.laneId,
                isDraggable: false,
              };
              Card.create(newCard)
                .then((card) => {
                  lane.cards.unshift(card._id);
                  lane.save();

                  Card.findById(card._id)
                    .populate("lane")
                    .populate("author")
                    .then((card) => {
                      res.json(card);
                    })
                    .catch((err) => {
                      res.status(400).json({ error: err });
                    });
                })
                .catch((err) => {
                  throw err;
                });
            }
          })
          .catch((err) => {
            res.status(400).json({ error: err });
          });
      } else {
        return res.status(400).json({ lane: "Lane does not exist" });
      }
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};

// Take destinationId, sourceId, destinationIdx, sourceIdx and cardId and move the card to the destination lane
exports.moveById = (req, res) => {
  Card.findById(req.body.cardId) // find the card by id
    .then((card) => {
      if (card) {
        if (card.lane.toString() !== req.body.sourceId) { // if the source lane provide is not the same as the card's lane
          return res
            .status(400)
            .json({ lane: "source lane is not matching!!" });
        }

        card.lane = req.body.destinationId; // set the lane to the destination id
        card.save(); // save the card
        Lane.findById(req.body.sourceId) // find the source lane
          .then((sourceLane) => {
            if (sourceLane) {
              // if same lane then move the card to the destination index in the same lane
              if (req.body.sourceId.toString()  === req.body.destinationId) {
                sourceLane.cards.splice(req.body.sourceIdx, 1);
                sourceLane.cards.splice(req.body.destinationIdx, 0, card._id); 
                sourceLane.save();
                return res.status(200).json({ card: card });
              }

              sourceLane.cards.splice(req.body.sourceIdx, 1); // remove the card from the source lane
              sourceLane.save(); // save the source lane
              Lane.findById(req.body.destinationId) // find the destination lane
                .then((destinationLane) => {
                  if (destinationLane) {
                    destinationLane.cards.splice(
                      req.body.destinationIdx,
                      0,
                      req.body.cardId
                    ); // add the card to the destination lane
                    destinationLane.save(); // save the destination lane
                    Card.findById(req.body.cardId) // find the card
                      .populate("lane")
                      .populate("author")
                      .then((card) => {
                        res.json(card);
                      })
                      .catch((err) => {
                        res.status(400).json({ error: err });
                      });
                  } else {
                    return res
                      .status(400)
                      .json({ lane: "Lane does not exist" });
                  }
                })
                .catch((err) => {
                  res.status(400).json({ error: err });
                });
            } else {
              return res.status(400).json({ lane: "Lane does not exist" });
            }
          })
          .catch((err) => {
            res.status(400).json({ error: err });
          });
      } else {
        return res.status(400).json({ card: "Card does not exist" });
      }
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};

// update the card by id in request body
exports.updateById = (req, res) => {
  Card.findById(req.body.id)
    .then((card) => {
      if (card) {
        card.title = req.body.title;
        card.description = req.body.description;
        card.isDraggable = true;
        card.save();
        Card.findById(card._id)
          .populate("lane")
          .populate("author")
          .then((card) => {
            res.json(card);
          })
          .catch((err) => {
            res.status(400).json({ error: err });
          });
      } else {
        return res.status(400).json({ card: "Card does not exist" });
      }
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};

exports.list = (req, res) => {
  Card.list().then((result) => {
    res.status(200).send(result);
  });
};

exports.getById = (req, res) => {
  Card.findById(req.params.id)
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((err) => {
      return res
        .status(400)
        .send({ error: "Error. Probably Wrong id.", err: err });
    });
};

exports.removeById = (req, res) => {
  Card.removeById(req.params.id).then((result) => {
    res.status(200).send({});
  });
};

exports.seed = (req, res) => {
  User.findOne({}) // find the first user in the database
    .then((user) => {
      Card.create(
        {
          title: "Card 1",
          description: "Card 1 description",
          author: user._id,
        },
        {
          title: "Card 2",
          description: "Card 2 description",
          author: user._id,
        },
        { title: "Card 3", description: "Card 3 description", author: user._id }
      ) // create 3 cards in the lane ToDo with author as the user id
        .then((cards) => {
          res.status(200).send(cards);
        })
        .catch((err) => {
          res.status(400).send({ error: err });
        });
    })
    .catch((err) => {
      res.status(400).send({ error: err });
    });
};
