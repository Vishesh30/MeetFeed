var Post = require("../models/post");
var request = require("request");

module.exports = function (router) {
  router.post("/post", function (req, res) {
    Post.find({ _id: req.body._id }, (err, resArr) => {
      //console.log(resArr);
      let post = new Post(req.body);
      if (resArr.length > 0) {
        var query = { _id: req.body._id };
        Post.findByIdAndUpdate(
          query,
          post,
          { upsert: true, new: true },
          function (err, doc) {
            //console.log(doc);
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
      //console.log(resArr);
      res.send(JSON.stringify(resArr));
    });
  });

  router.post("/post/:postId/upVote", function (req, res) {
    //console.log("===Headers===");console.log(req.headers);console.log("===Headers===");
    const ip = req.ip.split(':')[req.ip.split(':').length - 1];
    console.log(ip);
    const postId = req.params.postId;
    Post.findById(postId, (err, docs) => {
      if (!((docs.voters.findIndex(o => o._doc.ip === ip)) >= 0)) {   // first upvote
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
      } else if ((docs.voters.findIndex(o => { return o._doc.ip === ip && o._doc.downvote === true })) >= 0) {   //did user upvote after downvoting
        docs.voters[docs.voters.findIndex(o => o._doc.ip === ip)] = { ip: ip, upvote: true, downvote: false }
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
      else{
        res.send({message:"You have alerady voted for this question"});
      }
    });

  });

  router.post("/post/:postId/downVote", function (req, res) {
    const ip = req.ip.split(':')[req.ip.split(':').length - 1]
    const postId = req.params.postId;
    Post.findById(postId, (err, docs) => {
      if (!((docs.voters.findIndex(o => o._doc.ip === ip)) >= 0)) {   // first downvote
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
      } else if ((docs.voters.findIndex(o => { return o._doc.ip === ip && o._doc.upvote === true })) >= 0) {   //did user downvote after upvoting
        docs.voters[docs.voters.findIndex(o => o._doc.ip === ip)] = { ip: ip, upvote: false, downvote: true }
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
      else{
        res.send({message:"You have alerady voted for this question"});
      }
    });

  });

  router.post("/post/:postId/delete", function (req, res) {
    const ip = req.ip.split(':')[req.ip.split(':').length - 1]
    const postId = req.params.postId;
    Post.deleteOne({ _id: postId }).then(() => {
      console.log("Post " + postId + " deleted by ip " + ip);
    }).catch((error) => {
      console.log(error); // Failure 
    });
  });

  router.get("/stats", (req,res) => {
    const stats = {};
    Post.find((err, docs) => {
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
