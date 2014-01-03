var mongo = require('mongojs');
var fs = require('fs');
var db = mongo('zwitscha');
var deslanged_tweets = db.collection('deslanged_tweets');

var mapTask3 = function() {
    var wordArr = this.value.text.split(" ");
    for(var i = 0; i < wordArr.length; i++){
        emit( this._id, { "geo":this.value.geo, "text":wordArr[i] });
    }
};

var reduceTask3 = function(keys, values) {
    var val = 0;

    for(var i = 0; i<values.length; i++){
        if(values[i].text in sentimentD){
            if( sentimentD[values[i].text] == "positive" ){ val += 1 }
            if( sentimentD[values[i].text] == "negative" ){ val += -1 }
        }
    }
    return {"geo":values[0].geo ,"sentiment_count":val};
};

fs.readFile("data/subjclueslen1.tff", "utf-8", function(err, data){
    var sentimentDict = {};
    var lines = data.trim().split('\n');
    for(var i = 0; i<lines.length; i++){
        var sub = lines[i].slice(lines[i].indexOf("word1=")+6, lines[i].length );
        var w1 = sub.slice( 0, sub.indexOf(" ") );
        var w2 = sub.slice( sub.indexOf("priorpolarity=")+14, sub.length );
        sentimentDict[w1] = w2;
    }

    //change to deslanged_tweets.mapReduce(
    deslanged_tweets.mapReduce( mapTask3,
                      reduceTask3,
                      {
                        out: "sentiment_of_tweets",
                        scope: { sentimentD: sentimentDict  }
                      });

    db.close();
});