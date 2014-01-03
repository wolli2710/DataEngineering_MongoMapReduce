var mongo = require('mongojs');
var db = mongo('zwitscha');
var tweets = db.collection('tweets');
var tweet_count = db.collection('twitter_count');

//Einträge zählen die komplizierte:
//(db.tweets.count() würds auch tun)

var mapTask1 = function() {
    emit("result",1);
};

var reduceTask1 = function(keys, values) {
    return Array.sum(values);
};

tweets.mapReduce(mapTask1,
                reduceTask1,
                {
                    out: "twitter_count",
                });


db.close();
