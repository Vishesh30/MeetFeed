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

  router.post("/post/:postId/upVote", function (req, res) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //await GetUserIP()
    console.log(ip)
    const postId = req.params.postId;
    Post.findById(postId, (err, docs) => {
      if (!(docs.voters.findIndex(o => o.ip === ip)) > 0) {   // first upvote
        docs.voters.push(
          { ip: ip, upvote: true, downvote: false })
        Post.updateOne({ _id: postId },
          {
            upVotes: docs.upVotes + 1,
            voters: docs.voters
          },
          (error, updatedDoc) => {
            if (error) { console.log(error); }
            else { res.send(updatedDoc); }
          }
        );
      } else if ((docs.voters.findIndex(o => { o.ip === ip && o.downvote === true })) > 0) {   //did user upvote after downvoting
        docs.voters.push( // find
          { ip: ip, upvote: true, downvote: false })
        Post.updateOne({ _id: postId },
          {
            upVotes: docs.upVotes + 1,
            downVotes: docs.downVotes - 1,
            voters: docs.voters
          },
          (error, updatedDoc) => {
            if (error) { console.log(error); }
            else { res.send(updatedDoc); }
          }
        );
      }
    });

  });

  router.post("/post/:postId/downVote", function (req, res) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const postId = req.params.postId;
    Post.findById(postId, (err, docs) => {
      if (!(docs.voters.findIndex(o => o.ip === ip)) > 0) {   // first downvote
        docs.voters.push(
          { ip: ip, upvote: false, downvote: true })
        Post.updateOne({ _id: postId },
          {
            downVotes: docs.downVotes + 1,
            voters: docs.voters
          },
          (error, updatedDoc) => {
            if (error) { console.log(error); }
            else { res.send(updatedDoc); }
          }
        );
      } else if ((docs.voters.findIndex(o => { o.ip === ip && o.upvote === true })) > 0) {   //did user downvote after upvoting
        docs.voters.push( //find
          { ip: ip, upvote: false, downvote: true })
        Post.updateOne({ _id: postId },
          {
            upVotes: docs.upVotes - 1,
            downVotes: docs.downVotes + 1,
            voters: docs.voters
          },
          (error, updatedDoc) => {
            if (error) { console.log(error); }
            else { res.send(updatedDoc); }
          }
        );
      }
    });

  });

  return router;
};
