var Post = require("../models/post");
var Event = require("../models/event");
var request = require("request");

module.exports = function (router) {
  router.post("/event", function (req, res) {
    let event = new Event(req.body);
    event.save(function (err, doc) {
      if (err) res.send(err);
      else res.send(doc);
    });
  });

  router.get("/event", function (req, res) {
    Event.find((err, resArr) => {
      res.send(JSON.stringify(resArr));
    });
  });

  router.post("/event/:eventId/post", function (req, res) {
    Post.find({ _id: req.body._id, eventId: req.params.eventId }, (err, resArr) => {
      let postData = req.body;
      postData.eventId = req.params.eventId;
      let post = new Post(postData);
      if (resArr != undefined && resArr.length > 0) {
        var query = { _id: req.body._id, eventId: req.params.eventId };
        Post.findByIdAndUpdate(
          query,
          post,
          { upsert: true, new: true },
          function (err, doc) {
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

  router.get("/event/:eventId/post", function (req, res) {
    Post.find({ eventId: req.params.eventId }, (err, resArr) => {
      res.send(JSON.stringify(resArr));
    });
  });

  router.get("/event/:eventId/post/:postId", function (req, res) {
    Post.find(
      { _id: req.params.postId, eventId: req.params.eventId },
      (err, resArr) => {
        res.send(JSON.stringify(resArr));
      }
    );
  });

  router.post("/event/:eventId/post/:postId/upVote", function (req, res) {
    const ip = req.ip.split(":")[req.ip.split(":").length - 1];
    console.log(ip);
    const postId = req.params.postId;
    Post.findOne({ _id: postId, eventId: req.params.eventId }, (err, docs) => {
      if (!(docs.voters.findIndex((o) => o._doc.ip === ip) >= 0)) {
        // first upvote
        docs.voters.push({ ip: ip, upvote: true, downvote: false });
        Post.updateOne(
          { _id: postId, eventId: req.params.eventId },
          {
            upVotes: docs.upVotes + 1,
            voters: docs.voters,
          },
          (error, updatedDoc) => {
            if (error) {
              console.log(error);
            } else {
              res.send(updatedDoc);
            }
          }
        );
      } else if (
        docs.voters.findIndex((o) => {
          return o._doc.ip === ip && o._doc.downvote === true;
        }) >= 0
      ) {
        //did user upvote after downvoting
        docs.voters[docs.voters.findIndex((o) => o._doc.ip === ip)] = {
          ip: ip,
          upvote: true,
          downvote: false,
        };
        Post.updateOne(
          { _id: postId, eventId: req.params.eventId },
          {
            upVotes: docs.upVotes + 1,
            downVotes: docs.downVotes - 1,
            voters: docs.voters,
          },
          (error, updatedDoc) => {
            if (error) {
              console.log(error);
            } else {
              res.send(updatedDoc);
            }
          }
        );
      } else {
        res.send({ message: "You have alerady voted for this question" });
      }
    });
  });

  router.post("/event/:eventId/post/:postId/downVote", function (req, res) {
    const ip = req.ip.split(":")[req.ip.split(":").length - 1];
    const postId = req.params.postId;
    Post.findOne({ _id: postId, eventId: req.params.eventId }, (err, docs) => {
      if (!(docs.voters.findIndex((o) => o._doc.ip === ip) >= 0)) {
        // first downvote
        docs.voters.push({ ip: ip, upvote: false, downvote: true });
        Post.updateOne(
          { _id: postId, eventId: req.params.eventId },
          {
            downVotes: docs.downVotes + 1,
            voters: docs.voters,
          },
          (error, updatedDoc) => {
            if (error) {
              console.log(error);
            } else {
              res.send(updatedDoc);
            }
          }
        );
      } else if (
        docs.voters.findIndex((o) => {
          return o._doc.ip === ip && o._doc.upvote === true;
        }) >= 0
      ) {
        //did user downvote after upvoting
        docs.voters[docs.voters.findIndex((o) => o._doc.ip === ip)] = {
          ip: ip,
          upvote: false,
          downvote: true,
        };
        Post.updateOne(
          { _id: postId, eventId: req.params.eventId },
          {
            upVotes: docs.upVotes - 1,
            downVotes: docs.downVotes + 1,
            voters: docs.voters,
          },
          (error, updatedDoc) => {
            if (error) {
              console.log(error);
            } else {
              res.send(updatedDoc);
            }
          }
        );
      } else {
        res.send({ message: "You have alerady voted for this question" });
      }
    });
  });

  router.post("/event/:eventId/post/:postId/delete", function (req, res) {
    const ip = req.ip.split(":")[req.ip.split(":").length - 1];
    const postId = req.params.postId;
    Post.deleteOne({ _id: postId, eventId: req.params.eventId })
      .then(() => {
        console.log("Post " + postId + " deleted by ip " + ip);
      })
      .catch((error) => {
        console.log(error); // Failure
      });
  });

  router.get("/stats/:eventId", (req, res) => {
    const stats = {};
    Post.find({ eventId: req.params.eventId }, (err, docs) => {
      stats.totalQuestions = docs.length;
      stats.toalVotesCount = 0;
      const ip_list = [];
      docs.forEach((p) => {
        stats.toalVotesCount += p.voters.length;
        p.voters.forEach((v) => {
          ip_list.push(v.ip);
        });
        //ip_list.push(p.voters.map((v) => {return v.ip}));
      });
      const unique_ips = [...new Set(ip_list)];
      stats.uniqueVoterCount = unique_ips.length;
      //stats.uniqueIPList = unique_ips;
      res.send(stats);
    });
  });

  return router;
};
