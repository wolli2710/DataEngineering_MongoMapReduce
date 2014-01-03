var mongo = require('mongojs');
var fs = require('fs');
var db = mongo('zwitscha');
var tweets = db.collection('tweets');

var mapTask2 = function() {
    var wordArr = this.text.split(" ");
    for(var i = 0; i < wordArr.length; i++){
        emit( this._id, { "geo":this.geo, "text":wordArr[i] });
    }
};

var reduceTask2 = function(keys, values) {
    var wordArr = [];
    
    for(var i = 0; i<values.length; i++){
        if(values[i].text in slangD){
            wordArr.push(slangD[values[i].text]);
        }else{
            wordArr.push(values[i].text);
        }
    }
    return { "geo":values[0].geo, "text":wordArr.join(" ") };
};

fs.readFile("data/slangdict.csv", "utf-8", function(err, data){
    var slangDict = {};
    var lines = data.trim().split('\n');
    for(var i = 0; i<lines.length; i++){
        var w = lines[i].split(";");
        slangDict[w[0]] = w[1];
    }

    tweets.mapReduce(mapTask2,
                    reduceTask2,
                    {
                        out: "deslanged_tweets",
                        scope: { slangD: slangDict }
                    });
    db.close()
});