var fs = require("fs");
var mongo = require('mongojs');
var db = mongo('zwitscha');
var tweets = db.collection('sentiment_emote_tweets');

var sentimentArr = [];
var sentimentDict = {};
tweets.find(function(err,docs){
    for(var i = 0; i<docs.length; i++){
        sentimentArr.push([docs[i].value.geo[0], docs[i].value.geo[1] , docs[i].value.sentiment_count]);
    };
    sentimentDict["sentimentArray"] = sentimentArr;
    
    fs.writeFile("data/geo_sentiment_file.json", "data='"+JSON.stringify(sentimentDict)+"'", function(err){
        if(err) throw err;
        console.log("Saved file geo_sentiment_file");
    })
});