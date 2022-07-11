
const mongoose = require("mongoose");
let Lane = mongoose.model("Lane");

exports.insert = (req, res) => {
  Lane.findOne({ title: req.body.title })
    .then((lane) => {
      if (lane) {
        return res.status(400).json({ lane: "Lane already exists" });
      } else {
        const newlane = {
          title: req.body.title,
          cards: [],
        };
        Lane.create(newlane)
          .then((lane) => {
            res.json(lane);
          })
          .catch((err) => {
            throw err;
          });
      }
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};

exports.list = (req, res) => {
  Lane.list( )
  .then((result) => {
    res.status(200).send(result);
  });
};

exports.getById = (req, res) => {
  Lane.findById(req.params.laneId)
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
  Lane.removeById(req.params.laneId).then((result) => {
    res.status(200).send({});
  });
};

exports.seed = (req, res) => {

  // create 3 lanes with title "To Do", "In Progress", "Completed"
  const todoLane = {
    title: "To Do",
    id: "todo",
    cards: [],
  };
  const inProgressLane = {
    title: "In Progress",
    id: "in-progress",
    cards: [],
  };
  const completedLane = {
    title: "Completed",
    id: "completed",
    cards: [],
  };

  // get all lanes and check if any lane exits
  Lane.find({})
    .then((lanes) => {
      if (lanes.length === 0) {
        // Model create all above 3 lanes in sequence 
        Lane.create(todoLane)
          .then((lane) => {
            return Lane.create(inProgressLane);
          }
          ).then((lane) => {
            return Lane.create(completedLane);
          }
          ).then((lane) => {
            res.status(200).send(lane);
          }
          ).catch((err) => {
            res.status(400).send({ error: err });
          }
          );
      } else {
        res.status(200).send(lanes);
      }
    } 
    ).catch((err) => {
      res.status(400).send({ error: err });
    } 
    ); 
}
       