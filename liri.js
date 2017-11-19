var fs = require("fs");
var request = require("request");
var Spotify = require("node-spotify-api");
var twit = require("twitter");
var keys = require("./keys");

var args = process.argv.splice(2);

//console.log(args);

processCommand(args);

function processCommand(arguments) {
	let command = arguments[0];
	let param = arguments.splice(1).join(" ");
	console.log(param);

	switch(command) {
		case "my-tweets":
			displayTweets();
		break;
		case "spotify-this-song":
			if(!param) {
				param = "Wave of Mutilation";
			}
			displaySong(param);
		break;
		case "movie-this":
			if(!param) {
				param = "The Big Lebowski"
			}
			displayMovie(param);
		break;
		case "do-what-it-says":

		break;
		default:
			console.log("Unknown command");
		break;
	}
}


function displayTweets() {

}

function displaySong(songName) {
	let spotify = new Spotify({
		id: "435d2daab5e7436ab228721c09ff825b",
		secret: "603967090f38485b8d73c9eae0fa6b0f"
	});
	spotify.search({type: "track", query: songName, limit: 1}, function(err, data){
		if (err) {
			console.log(err);
		}
		// console.log(JSON.stringify(data, null, 4));
		let info = data.tracks.items[0];
		console.log("Artist: " + info.artists[0].name);
		console.log("Song title: " + info.name);
		console.log("Preview link: " + info.preview_url);
		console.log("Album: " + info.album.name);
	});
}

function displayMovie(movieName) {
	request("http://www.omdbapi.com/?t=" + movieName + "&plot=short&apikey=40e9cece", function(error, response, body) {
	if(!error && response.statusCode === 200) {
	    let data = (JSON.parse(body));
	    console.log(data.Title);
	    console.log(data.Year);
	    console.log(data.imdbRating);
	    //rotten tomatoes rating
	    console.log(data.Ratings[1].Value)
	    console.log(data.Country);
	    console.log(data.Language);
	    console.log(data.Plot);
	    console.log(data.Actors);
	  }
	});
}