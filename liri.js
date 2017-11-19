//requires
var fs = require("fs");
var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var twitterKeys = require("./keys");

//globals
var f = "./random.txt";
var args = process.argv.splice(2);
var defaultSong = "Wave of Mutilation";
var defaultMovie = "The Big Lebowski";
var logFile = "liri_log.txt";

//"main"
processCommand(args);

//functions
function processCommand(arguments) {
	let command = arguments[0];
	let param = arguments.splice(1).join(" ");

	switch(command) {
		case "my-tweets":
			logMsg("---------------------------\nRunning my-tweets", true);
			displayTweets();
		break;
		case "spotify-this-song":
			if (!param) {
				param = defaultSong;
			}
			logMsg(`---------------------------\nRunning spotify-this-song for ${param}`, true);
			displaySong(param);
		break;
		case "movie-this":
			if (!param) {
				param = defaultMovie;
			}
			logMsg(`---------------------------\nRunning movie-this for ${param}`, true);
			displayMovie(param);
		break;
		case "do-what-it-says":
			logMsg(`---------------------------\nRunning do-what-it-says from file ${f}:`, true);
			processFile(f);
		break;
		default:
			logMsg("Unknown command");
		break;
	}
}

function displayTweets() {
	let client = new Twitter(twitterKeys);
	let params = {screen_name: "nodejs", count: 20, exclude_replies: true, include_rts: false};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
			logMsg(error);
		}
		else {
			tweets.forEach(function(tweet) {
				logMsg(`Screen name: ${tweet.user.screen_name}`);
				logMsg(`Tweet: ${tweet.text}`);
				logMsg(`When: ${tweet.created_at}`);
				logMsg("-----------------------");
			});
		}
	});
}

function displaySong(songName) {
	let spotify = new Spotify({
		id: "435d2daab5e7436ab228721c09ff825b",
		secret: "603967090f38485b8d73c9eae0fa6b0f"
	});
	spotify.search({type: "track", query: songName, limit: 1}, function(err, data){
		if (err) {
			logMsg(err);
		}
		// console.log(JSON.stringify(data, null, 4));
		let info = data.tracks.items[0];
		logMsg(`Artist: ${info.artists[0].name}`);
		logMsg(`Song title: ${info.name}`);
		logMsg(`Preview link: ${info.preview_url}`);
		logMsg(`Album: ${info.album.name}`);
	});
}

function displayMovie(movieName) {
	request("http://www.omdbapi.com/?t=" + movieName + "&plot=short&apikey=40e9cece", function(error, response, body) {
	if (!error && response.statusCode === 200) {
	    let data = (JSON.parse(body));
	    logMsg(`Title: ${data.Title}`);
	    logMsg(`Year: ${data.Year}`);
	    logMsg(`IMDB Rating: ${data.imdbRating}`);
	    //rotten tomatoes rating
	    logMsg(`Rotten Tomatoes Rating: ${data.Ratings[1].Value}`)
	    logMsg(`Country: ${data.Country}`);
	    logMsg(`Language: ${data.Language}`);
	    logMsg(`Plot: ${data.Plot}`);
	    logMsg(`Actors: ${data.Actors}`);
	  }
	});
}

function processFile(filePath) {
	fs.readFile(filePath, "utf8", function(err, data) {
		if (err) {
			logMsg(err);
		}
		let tokens = data.split(",");
		processCommand(tokens);
	});
}

function logMsg(s, suppressConsole) {
	if (!suppressConsole) {
		console.log(s);
	}
	s += "\n";
	fs.appendFileSync(logFile, s, function(err) {
		if (err) {
			logMsg(err);
		}
	});
}