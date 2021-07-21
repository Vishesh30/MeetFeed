var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EventSchema = new Schema({
  eventName: {type: String, required: true},
  isActive: {type: Boolean, default: true},
},{ timestamps: true });

module.exports = mongoose.model("Event", EventSchema);