var Post = require("../models/post");
var request = require("request");

module.exports = function (router) {

  router.get("", function (req, res) {

    console.log(req.connection.remoteAddress);
    let sortOrder = "votes";
    if(req.cookies){
      sortOrder = req.cookies.sortOrder;
    }

    Post.find((err, postList) => {
      //console.log(postList);
      if(sortOrder === "votes"){
        postList.sort((f,s) => {
          return (s.upVotes - s.downVotes) - (f.upVotes - f.downVotes);
        });
      }
      else{
        // TODO implement sorting by time
        postList.sort((f,s) => {
          return s.downVotes - f.downVotes;
        });
      }

      res.render("index", {postList: postList});

    });
  });

  router.get("/privacy", function (req, res) {
    res.render("privacy", {});
  });

  return router;
};
