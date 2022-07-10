const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const laneSchema = new Schema(
  {
    id: { type: String, required: false },
    title: {
      type: String,
      required: false,
    },
    label: {
      type: String,
      required: false,
    },
    cards: [{ type: Schema.Types.ObjectId, ref: "Card" }],
  },
  { timestamps: true }
);

laneSchema.statics.create = function (dataEntity) {
  const new_lane = new this(dataEntity);
  return new_lane.save();
};

laneSchema.statics.list = function () {
  //return promise to be used in controller that returns a list of all lanes
  return new Promise((resolve, reject) => {
    this.find() //find all lanes
      .populate({
        path: "cards",
        model: "Card",
        populate: [
          {
            path: "members",
            model: "User",
          },
          {
            path: "author",
            model: "User",
          },
        ],
      })
      .exec(function (err, lanes) {
        if (err) {
          reject(err);
        } else {
          resolve(lanes);
        }
      });
  });
};

laneSchema.statics.removeById = function (id) {
  return new Promise((resolve, reject) => {
    this.deleteOne({ _id: id }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
};

mongoose.model("Lane", laneSchema);
