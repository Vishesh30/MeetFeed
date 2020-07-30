var Post = require("../models/post");
var request = require("request");

module.exports = function (router) {

  router.get("", function (req, res) {
    Post.find((err, postList) => {
      //console.log(postList);
      postList.sort((f,s) => {
        return (s.upVotes - s.downVotes) - (f.upVotes - f.downVotes);
      });
      res.render("index", {postList: postList});
    });
  });

  router.get("/privacy", function (req, res) {
    res.render("privacy", {});
  });

  return router;
};
