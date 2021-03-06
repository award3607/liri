//requires
var fs = require("fs");
var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var twitterKeys = require("./keys");

//globals
var args = process.argv.splice(2);
var defaults = {
	screenName: "nodejs",
	song: "Wave of Mutilation",
	movie: "The Big Lebowski",
	file: "./random.txt",
	logFile: "liri_log.txt"
};

//"main"
processCommand(args);

//functions
function processCommand(arguments) {
	let command = arguments[0];
	let param = arguments.splice(1).join(" ");
	logMsg(`---------------------------\nRunning ${command} for ${param ? `"${param}"` : `default`}`, true);

	switch(command) {
		case "my-tweets":
			if (!param) {
				param = defaults.screenName;
			}
			displayTweets(param);
		break;
		case "spotify-this-song":
			if (!param) {
				param = defaults.song;
			}
			displaySong(param);
		break;
		case "movie-this":
			if (!param) {
				param = defaults.movie;
			}
			displayMovie(param);
		break;
		case "do-what-it-says":
			processFile(defaults.file);
		break;
		default:
			logMsg(`Unknown command: ${command}`);
		break;
	}
}

function displayTweets(screenName) {
	console.log(`Twitter screen_name: ${screenName}`);
	let client = new Twitter(twitterKeys);
	let params = {screen_name: screenName, count: 20, exclude_replies: true, include_rts: false};
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
		let info = data.tracks.items[0];
		logMsg(`Artist: ${info.artists[0].name}`);
		logMsg(`Song title: ${info.name}`);
		logMsg(`Preview link: ${info.preview_url}`);
		logMsg(`Album: ${info.album.name}`);
	});
}

function displayMovie(movieName) {
	request(`http://www.omdbapi.com/?t=${movieName}&plot=short&apikey=40e9cece`, function(error, response, body) {
		if (!error && response.statusCode === 200) {
		    let data = (JSON.parse(body));
		    logMsg(`Title: ${data.Title}`);
		    logMsg(`Year: ${data.Year}`);
		    logMsg(`IMDB Rating: ${data.imdbRating}`);
		    logMsg(`Rotten Tomatoes Rating: ${data.Ratings[1] ? `${data.Ratings[1].Value}` : 'No rating available'}`);
		    logMsg(`Country: ${data.Country}`);
		    logMsg(`Language: ${data.Language}`);
		    logMsg(`Plot: ${data.Plot}`);
		    logMsg(`Actors: ${data.Actors}`);
		}
		else {
			logMsg(error);
		}
	});
}

function processFile(filePath) {
	fs.readFile(filePath, "utf8", function(err, data) {
		if (err) {
			logMsg(err);
		}
		let tokens = data.split(",");
		tokens = tokens.map(function(token) {
			return token.replace(/"/g, '').trim();
		});
		processCommand(tokens);
	});
}

function logMsg(s, suppressConsole) {
	if (!suppressConsole) {
		console.log(s);
	}
	s += "\n";
	fs.appendFileSync(defaults.logFile, s, function(err) {
		if (err) {
			logMsg(err);
		}
	});
}