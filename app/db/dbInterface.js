var mongoose = require('mongoose');

//Connect to Mongo DB
var connectMongoDB = function(appEnv){

    if(appEnv.isLocal === true){
        mongoose.connect('mongodb://localhost:27017/meanApp',function(err,){
            if(err) console.log("Error while connecting to DB!");
                else
                    console.log("Connected to MongoDB");
        });
    }else{
        mongoose.connect(appEnv.services.mongodb[0].credentials.uri,function(err,){
            if(err) console.log("Error while connecting to DB!");
                else
                    console.log("Connected to MongoDB");
        });
    }

};  

module.exports ={
    connectMonogDB: connectMongoDB
};

