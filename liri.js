//retrieve api keys, twitter, spotify and request 
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

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
	var command = process.argv[2].trim();
}else{
	console.log("command not recognized");
}

//calls function based on commands given
if(command === "my-tweets"){
	getTweets();
}else if(command === "spotify-this-song"){
	if(process.argv[3] === undefined){
		var song = "The Sign";
	}else{
		var song = process.argv[3].trim();
		console.log("song: " + song);
	}
	getSong(song);
}else if(command === "movie-this"){
	if(process.argv[3] === undefined){
		var movie = "Mr. Nobody";
	}else{
		var movie = process.argv[3].trim();
		console.log("movie: " + movie);
	}
	getMovie(movie);
}else if(command === "do-what-it-says"){
	doFile();
}


//interacts with twitter npm to retrieve 20 most recent tweets
function getTweets(){
	client.get("https://api.twitter.com/1.1/statuses/home_timeline.json", function(error, tweets, response){
		if(error){
			console.log(error);
		}

		// console.log(JSON.stringify(tweets, null, 2));
		for(var i = 0; i < tweets.length; i++){
			console.log(tweets[i].text);
			console.log(tweets[i].created_at);
			fs.appendFile(textFile, "Hello Kitty", function(err) {

  			// If an error was experienced we say it.
  		// 	if (err) {
    // 			console.log(err);
  		// 	}

  		// 	// If no error is experienced, we'll log the phrase "Content Added" to our node console.
  		// 	else {
    // 		console.log("Content Added!");
 			// }			

});
		}
	});
}


//interacts with node-spotify-api to retrieve information given a song title
function getSong(song){
	song.replace("\s", "+");
	song = "\"" + song + "\"";
	var query = "https://api.spotify.com/v1/search?q=\""+song+"\"&type=track&limit=1&market=US";
	// console.log(query);
	spotify.request(query).then(function(data){
		// console.log(data);
	// console.log(data.tracks.items)
	var spotifiedSong = data.tracks.items[0];
	console.log("Artists: " + spotifiedSong.album.artists[0].name);
	console.log("Song Name: " + spotifiedSong.name);
	console.log("Preview: " + spotifiedSong.external_urls.spotify);
	console.log("Album: " + spotifiedSong.album.name);
	})
	.catch(function(err){
		console.error('Error occurred: ' + err);
	});
}

//uses request api to interact with omdb api and retireive movie info by title
function getMovie(movie){
	movie.replace("\s", "+");
	movie = "\"" + movie + "\"";
	var query = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie;
	request(query, function(error, data, body){
		if(error){
			console.log(error);
		}

		// console.log(data);
		// console.log(body);
		var movieInfo = JSON.parse(body);
		console.log("Title: " + movieInfo["Title"]);
		console.log("Release year: " + movieInfo.Year);
		console.log("IMDB Rating: " + movieInfo.imdbRating);
		for(var i = 0; i < movieInfo.Ratings.length; i ++){
			if(movieInfo.Ratings[i].Source == "Rotten Tomatoes"){
				console.log("Rotten Tomatoes: " + movieInfo.Ratings[i].Value);
				i = movieInfo.Ratings.length;
			}
		}
		console.log("Country: " + movieInfo.Country);
		console.log("Language: " + movieInfo.Language);
		console.log("Plot: " + movieInfo.Plot);
		console.log("Actors: " + movieInfo.Actors);

	});
}


//reads random.txt and parses commands to follow 
function doFile(){
	fs.readFile("random.txt", "utf8", function(error, data) {

  // If the code experiences any errors it will log the error to the console.
  if (error) {
    return console.log(error);
  }

  // We will then print the contents of data
  console.log(data);
  var inputs = data.split("\n");
  console.log(inputs);
  for(var j = 0; j < inputs.length; j++){
 	 	// Then split it by commas (to make it more readable)
 	 	var dataArr = inputs[j].split(", ");

	  // We will then re-display the content as an array for later use.
	  if(dataArr[0].trim() === "my-tweets"){
	  	getTweets();
	  }else if(dataArr[0].trim() === "spotify-this-song"){
	  	getSong(dataArr[1].trim());
	  }else if(dataArr[0].trim() === "movie-this"){
	  	getMovie(dataArr[1].trim());
	  }
	}
});
}