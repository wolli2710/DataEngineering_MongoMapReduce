var mongo = require('mongojs');
var fs1 = require('fs');
var fs2 = require('fs');
var db = mongo('zwitscha');
var tweets = db.collection('deslanged_tweets');

var mapTask3 = function() {
    var wordArr = this.value.text.split(" ");
    var word;
    for(var i = 0; i < wordArr.length; i++){
        word = wordArr[i];
        if(word in emoteD){
            word = emoteD[word];
        };
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
    return {"geo":values[0].geo,"sentiment_count":val};
};

fs1.readFile("data/subjclueslen1.tff", "utf-8", function(err, data){
    var sentimentDict = {};
    var lines = data.trim().split('\n');
    for(var i = 0; i<lines.length; i++){
        var sub = lines[i].slice(lines[i].indexOf("word1=")+6, lines[i].length );
        var w1 = sub.slice( 0, sub.indexOf(" ") );
        var w2 = sub.slice( sub.indexOf("priorpolarity=")+14, sub.length );
        sentimentDict[w1] = w2;
    }

    fs2.readFile("data/emoticons.csv", "utf-8", function(err2, data2){
        var emoteDict = {};
        var lines = data2.trim().split('\n');
        for(var i = 0; i<lines.length; i++){
            var w = lines[i].split(",");
            emoteDict[w[0]] = w[1];
        }

        //change to deslanged_tweets.mapReduce(
        tweets.mapReduce( mapTask3,
                          reduceTask3,
                          {
                            out: "sentiment_emote_tweets",
                            scope: { sentimentD: sentimentDict,
                                    emoteD: emoteDict }
                          });
    db.close();
    });
});



//Count Smiley Kathegories

// var mongo = require('mongojs');
// var fs = require('fs');
// var db = mongo('zwitscha');
// var tweets = db.collection('tweets');

// var mapTask = function() {
//     var wordArr = this.text.split(" ");

//     for(var i = 0; i<wordArr.length; i++){
//         if(wordArr[i] in emoteD){
//             emit( emoteD[wordArr[i]], 1);
//         }
//     }
// };

// var reduceTask = function(keys, values) {
//     return Array.sum(values);
// };

// fs.readFile("data/emoticons.csv", "utf-8", function(err, data){
//     var emoteDict = {};
//     var lines = data.trim().split('\n');
//     for(var i = 0; i<lines.length; i++){
//         var w = lines[i].split(",");
//         emoteDict[w[0]] = w[1];
//         console.log(w[0])
//     }

//     tweets.mapReduce(mapTask,
//                     reduceTask,
//                     {
//                         out: "emoteCount",
//                         scope: { emoteD: emoteDict }
//                     });
//     db.close()
// });
