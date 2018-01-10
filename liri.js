//retrieve api keys, twitter, spotify and request 
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
//set up twitter api keys
var twitterKeys = keys.twitterKeys;
var consumer_key = twitterKeys.consumer_key;
var consumer_secret = twitterKeys.consumer_secret;
var access_token_key = twitterKeys.access_token_key;
var access_token_secret = twitterKeys.access_token_secret;
// console.log(twitterKeys);
// var client = new Twitter({
// 	consumer_key: process.env[twitterKeys.consumer_key],
// 	consumer_secret: process.env[twitterKeys.consumer_secret],
// 	access_token_key: process.env[twitterKeys.access_token_key],
// 	access_token_secret: process.env[twitterKeys.access_token_secret]
// });
var client = new Twitter ({
	consumer_key: consumer_key,
	consumer_secret: consumer_secret,
	access_token_key: access_token_key,
	access_token_secret: access_token_secret
});


//set up spotify api keys
var client_ID = keys.spotifyKeys.client_ID;
var client_secret = keys.spotifyKeys.client_secret;
var spotify = new Spotify({
	id: client_ID,
	secret: client_secret
});


//get command line input
if(process.argv[2] !== undefined){
	var command = process.argv[2];
}else{
	console.log("command not recognized");
}


if(command === "my-tweets"){
	getTweets();
}else if(command === "spotify-this-song"){
	if(process.argv[3] === undefined){
		var song = "The+Sign";
	}else{
		var song = process.argv[3].trim();
		song.replace("\s", "+");
		song = "\"" + song + "\"";
		console.log("song: " + song);
	}
	getSong(song);
}



function getTweets(){
	client.get("https://api.twitter.com/1.1/statuses/home_timeline.json", function(error, tweets, response){
		if(error){
			console.log(error);
		}

		// console.log(JSON.stringify(tweets, null, 2));
		for(var i = 0; i < tweets.length; i++){
			console.log(tweets[i].text);
			console.log(tweets[i].created_at);
		}
	});
}

function getSong(song){
	var query = "https://api.spotify.com/v1/search?q=\""+song+"\"&type=track&limit=1&market=US";
	console.log(query);
	spotify.request(query).then(function(data){
		// console.log(data);
	console.log(data.tracks.items)
	var spotifiedSong = data.tracks.items[0];
	console.log("Artists: " + spotifiedSong.album.artists.join(", "));
	console.log("Song Name: " + spotifiedSong.name);
	console.log("Preview: " + spotifiedSong.external_urls.spotify);
	console.log("Album: " + spotifiedSong.album.name);
	})
	.catch(function(err){
		console.error('Error occurred: ' + err);
	});
}