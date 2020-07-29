var Post = require("../models/post");
var request = require("request");

module.exports = function (router) {
  router.post("/post", function (req, res) {
    Post.find({ _id: req.body._id }, (err, resArr) => {
      console.log(resArr);
      let post = new Post(req.body);
      if (resArr.length > 0) {
        var query = { _id: req.body._id };
        Post.findByIdAndUpdate(
          query,
          post,
          { upsert: true, new: true },
          function (err, doc) {
            console.log(doc);
            if (err) return res.send(500, { error: err });
            return res.send(doc);
          }
        );
      } else {
        post.save(function (err, doc) {
          if (err) res.send(err);
          else res.send(doc);
        });
      }
    });
  });

  router.get("/post", function (req, res) {
    Post.find((err, resArr) => {
      console.log(resArr);
      res.send(JSON.stringify(resArr));
    });
  });

  router.post("/post/:postId/upVote", function (req, res){

    const postId = req.params.postId;
    Post.findById(postId, (err, docs) => {
      Post.updateOne( {_id:postId},
                      {upVotes: docs.upVotes + 1},
                      (error,updatedDoc) => {
                        if(error){console.log(error);}
                        else{res.send(updatedDoc);}
                      }
                    );
    });

  });

  router.post("/post/:postId/downVote", function (req, res){

    const postId = req.params.postId;
    Post.findById(postId, (err, docs) => {
      Post.updateOne( {_id:postId},
                      {downVotes: docs.downVotes + 1},
                      (error,updatedDoc) => {
                        if(error){console.log(error);}
                        else{res.send(updatedDoc);}
                      }
                    );
    });

  });

  return router;
};
