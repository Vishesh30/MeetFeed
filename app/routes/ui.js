var Post = require("../models/post");
var request = require("request");

module.exports = function (router) {

  router.get("", function (req, res) {

    let sortOrder = "votes";
    if(req.cookies.sortOrder){
      sortOrder = req.cookies.sortOrder;
    }

    console.log(Date() + "---" + req.ip + "---" + req.connection.remoteAddress + "---" + sortOrder);

    Post.find((err, postList) => {
      
      if(sortOrder === "votes"){
        postList.sort((f,s) => {
          return (s.upVotes - s.downVotes) - (f.upVotes - f.downVotes);
        });
      }
      else{
        // TODO implement sorting by time
        postList.sort((f,s) => {
          return (new Date(s.commentTime)).getTime() - (new Date(f.commentTime)).getTime();
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
