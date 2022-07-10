const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const cardSchema = new Schema({
  id : { type: String, required: false },
  title: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  isDraggable: { type: Boolean, required: false },
  author : { type : Schema.Types.ObjectId, ref: 'User' },
  members:  [{ type : Schema.Types.ObjectId, ref: 'User' }],
  lane: { type : Schema.Types.ObjectId, ref: 'Lane' },

}, { timestamps: true });
  


cardSchema.statics.create = function(dataEntity) {
  const new_card = new this(dataEntity);
  return new_card.save();
};

cardSchema.statics.list = function() {
  //return promise to be used in controller that returns a list of all cards
  return new Promise((resolve, reject) => {
    this.find() //find all cards
      .exec(function(err, lanes) {
        if (err) {
          reject(err);
        } else {
          resolve(lanes);
        }
      });
  });

};

cardSchema.statics.removeById = function(id) {
  return new Promise((resolve, reject) => {
    this.deleteOne({ _id: id }, err => {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
};



mongoose.model("Card", cardSchema);
