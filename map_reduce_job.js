var mongo = require('mongojs');
var fs = require('fs');

var db = mongo('zwitscha');

var tweets = db.collection('tweets');
var tweet_count = db.collection('twitter_count');
var deslanged_tweets = db.collection('deslanged_tweets');


var slangDict = {};
var sentimentDict = {};



var mapTask2 = function() {
    emit(this._id, {"geo":this.geo, "text":this.text});
};

var reduceTask2 = function(keys, values) {
    // function deSlanger(txt){
    //     txtArr = txt.split(" ");
    //     newStr = "";
    //     for(var i = 0; i<txtArr.length; i++){
    //         if(txtArr[i] in slangDict){
    //             newStr += slangDict[txtArr[i]];
    //         } else {
    //             newStr += txtArr[i];
    //         }
    //         if(i < txtArr.length-1){
    //             newStr += " ";
    //         }
    //     }
    //     return txtArr
    // };
    // var newString = deSlanger(values.text);
    return JSON.stringify( {"geo":values.geo, "text":"newString"} );
};

var finalizeTask2 = function(keys, values){
    txtArr = values.text.split(" ");
    newStr = "";
    for(var i = 0; i<txtArr.length; i++){
        if(txtArr[i] in slangDict){
            newStr += slangDict[txtArr[i]];
        } else {
            newStr += txtArr[i];
        }
        if(i < txtArr.length-1){
            newStr += " ";
        }
    }
    return newStr;
}

fs.readFile("slangdict.csv", "utf-8", function(err, data){
    var lines = data.trim().split('\n');
    for(var i = 0; i<lines.length; i++){
        var w = lines[i].split(";");
        slangDict[w[0]] = w[1];
    }


    var wtf = tweets.mapReduce(mapTask2, 
                                reduceTask2, 
                                {
                                    out: "deslanged_tweets",
                                    finalize: finalizeTask2
                                });


    // deslanged_tweets.find().forEach(function(err, doc){
    //     if(!doc){
    //         return;
    //     }
    //     console.log(doc)
    // });
});




var dictionaryCheck = function(str){

}





var checkSentiments = function(str){
    var currentArr = str.split(" ");
    var cnt = 0;
    for(var i = 0; i<currentArr.length; i++){
        if(currentArr[i] in slangDict){
            dictionaryCheck(slangDict[currentArr[i]]);
        } else {
            dictionaryCheck(currentArr[i]);
        }
    }
};








// fs.readFile("subjclueslen1.tff", "utf-8", function(err, data){
//     var lines = data.trim().split('\n');
//     for(var i = 0; i<lines.length; i++){
//         var sub = lines[i].slice(lines[i].indexOf("word1=")+6, lines[i].length );
//         var w1 = sub.slice( 0, sub.indexOf(" ") );
//         var w2 = sub.slice( sub.indexOf("priorpolarity=")+14, sub.length );
//         sentimentDict[w1] = w2;
//     }
// });




//Einträge zählen die komplizierte:
//(db.tweets.count() würds auch tun)

// var mapTask1 = function() {
//     emit("result",1);
// };

// var reduceTask1 = function(keyCustId, values) {
//     return Array.sum(values);
// };

// tweet_count.find().forEach(function(err, doc){
//     if(!doc){
//         return;
//     }
//     console.log(doc)
// });

// tweets.mapReduce(mapTask1, reduceTask1, {out: "twitter_count"});