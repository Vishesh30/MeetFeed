var Event = require("../models/event");

module.exports = function (req, res, next) {
  //get Event ID from request parameter
  eventId = req.params.eventId;
  if (req.method == "POST" && eventId) {
    //check if event is still active
    Event.findOne({_id: eventId}, function (err, docs) {
        if(docs.isActive) {
          return next();
        }else {
            return res.status(500).send({ 
                success: false, 
                message: 'Event has already Ended. You cannot post anymore.!'
            });
    
        }
    });
  } else {
    next();
  }
};
