var mongo = require('mongojs');
var fs = require('fs');

var db = mongo('zwitscha');

var tweets = db.collection('tweets');
var deslanged_tweets = db.collection('deslanged_tweets');


var mapTask2 = function() {
    emit(this._id, {"geo":this.geo, "text":this.text.split(" ")});
};

var finalizeTask2 = function(keys, values) {
    newStr = "";
    var txtArr = values.text;

    for(var i = 0; i<txtArr.length; i++){
        if(txtArr[i] in slangD){
            newStr += slangD[txtArr[i]];
        } else {
            newStr += txtArr[i];
        }
        if(i < txtArr.length-1){
            newStr += " ";
        }
    }

    return {"geo":values.geo, "text":newStr};
};

var reduceTask2 = function(keys, values) {
    return values;
};

fs.readFile("slangdict.csv", "utf-8", function(err, data){
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
                         finalize: finalizeTask2,
                         scope: { slangD: slangDict }
                     });

    db.close()
});

