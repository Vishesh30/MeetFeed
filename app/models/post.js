var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostsSchema = new Schema({
  postContent: { type: String, lowercase: true, required: true, unique: true },
  upVotes: { type: Number },
  downVotes: { type: Number },
  voters: [
    {
      ip: String,
      upvote: Boolean,
      downvote: Boolean,
    },
  ],
});

module.exports = mongoose.model("Post", PostsSchema);
