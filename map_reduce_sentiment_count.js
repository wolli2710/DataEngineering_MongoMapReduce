var mongo = require('mongojs');
var fs = require('fs');

var db = mongo('zwitscha');

var tweets = db.collection('tweets');
var sentiment_of_tweets = db.collection('sentiment_of_tweets');


var mapTask3 = function() {
    emit(this._id, {"geo":this.geo, "text":this.text.split(" ")});
};


var reduceTask3 = function(keys, values) {

    str = values.text;
    val = 0;

    for(var i = 0; i<str.length; i++){
        if(str[i] in sentimentD){
            if( sentimentD[str[i]] == "positive" ){ val = 1 }
            if( sentimentD[str[i]] == "negative" ){ val = -1 }
        }
    }

    return val;
};

var finalizeTask3 = function(keys, values){
    str = values.text;
    val = 0;

    for(var i = 0; i<str.length; i++){
        if(str[i] in sentimentD){
            if( sentimentD[str[i]] == "positive" ){ val = 1 }
            if( sentimentD[str[i]] == "negative" ){ val = -1 }
        }
    }

    return val;
};


fs.readFile("subjclueslen1.tff", "utf-8", function(err, data){
    var sentimentDict = {};
    var lines = data.trim().split('\n');
    for(var i = 0; i<lines.length; i++){
        var sub = lines[i].slice(lines[i].indexOf("word1=")+6, lines[i].length );
        var w1 = sub.slice( 0, sub.indexOf(" ") );
        var w2 = sub.slice( sub.indexOf("priorpolarity=")+14, sub.length );
        sentimentDict[w1] = w2;
    }

    //change to deslanged_tweets.mapReduce(
    tweets.mapReduce( mapTask3,
                      reduceTask3,
                      {
                        out: "sentiment_of_tweets",
                        finalize: finalizeTask3,
                        scope: { sentimentD: sentimentDict  }
                      });

    db.close();
});
