DataEngineering_MongoMapReduce
==============================
  
Twitter crawler that saves tweets to mongo.js and some Mongo Mapreduce jobs  
  
## Usage:  

1. clone the repository  
2. make sure you have node.js installed and run 
"npm install"
3. make sure you have mongodb installed
4. to collect tweets from the twitter streaming api open the file "keys.js.dist" and insert your twitter keys. now rename the file to "keys.js"  
5. start crawling tweets  
"node twitter_streaming_api.js"
6. if you want to count the number of your tweets
"node map_reduce_count_job.js"
you will find the current count under the collection "twitter_count"
7. replace slang words with their actual meaning by running
"node map_reduce_remove_slang.js"
this could take a while
8. create some objects with geolocation and sentiment score
"node map_reduce_sentiment_count.js"
this could take a while
9. another object creation task that converts emoteicons to their english meaning:
"node map_reduce_emoticons.js"
10. create the file called "data/geo_sentiment_file.json"
"node twitter_sentiment_dict_creation.js"
11. make sure to have an internet connection,    
go to the views folder and open the file "index.html"

### The blue Markers are neutral
### The red Markers got a negative sentiment score
### The green Markers got a positive sentiment score
