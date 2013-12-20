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

var finalizeTask1 = function(keys, values){
    return values;
}

tweet_count.find().forEach(function(err, doc){
    if(!doc){
        return;
    }
    console.log(doc)
});

tweets.mapReduce(mapTask1,
                reduceTask1,
                {
                    out: "twitter_count",
                    finalize: finalizeTask1
                });


db.close();
