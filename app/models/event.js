var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EventSchema = new Schema({
  eventName: {type: String, required: true},
});

module.exports = mongoose.model("Event", EventSchema);