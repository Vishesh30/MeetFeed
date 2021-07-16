var Post = require("../../app/models/post");
const axios = require("axios");

module.exports = function (router) {
  router.get("", async function (req, res) {
    let url = "http://" + req.headers.host + "/api/event";
    respData = await axios.get(url);
    res.render("home", { eventList: respData.data });
  });

  router.get("/event/:eventId/showposts", async function (req, res) {
    //getPosts
    let sortOrder = "votes";
    if (req.cookies.sortOrder) {
      sortOrder = req.cookies.sortOrder;
    }

    let eventId = req.params.eventId;

    let url = "http://" + req.headers.host + "/api/event/" + eventId + "/post";
    respData = await axios.get(url);
    let postList = respData.data;

    if (sortOrder === "votes") {
      postList.sort((f, s) => {
        return s.upVotes - s.downVotes - (f.upVotes - f.downVotes);
      });
    } else {
      // TODO implement sorting by time
      postList.sort((f, s) => {
        return (
          new Date(s.commentTime).getTime() - new Date(f.commentTime).getTime()
        );
      });
    }

    res.render("index", { postList: postList, event: eventId });
  });

  router.get("/privacy", function (req, res) {
    res.render("privacy", {});
  });

  return router;
};
