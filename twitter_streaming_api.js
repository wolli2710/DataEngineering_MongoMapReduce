var twitter = require('ntwitter');
var mongo = require('mongojs');
var keys = require('./keys.js');

//mongojs

var t = new twitter({
  consumer_key: keys.consumer_key ,
  consumer_secret: keys.consumer_secret ,
  access_token_key: keys.access_token_key ,
  access_token_secret: keys.access_token_secret 
});

var db = mongo('zwitscha');
var tweets = db.collection('tweets');

t.stream('statuses/filter', { locations: '-180,-90,180,90'}, function(stream) {
    stream.on('data', function (data) {
        if(data.geo != null && "coordinates" in data.geo){
            if(data.lang == "en"){

                tweets.insert({"geo":data.geo["coordinates"], "text":data.text}, function(err){
                    if(err){
                        console.log("ERROR when querying from mongodb");
                    }
                });
              
            }

        }
    });
});