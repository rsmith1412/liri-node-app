
//LIRI will take arguments and produce data with them

var keys = require("./keys.js");
var fs = require('fs');
var twitter = require ('twitter');
var spotify = require ('spotify');
var request = require ('request');
//Will take in a specific command from the user
var command = process.argv[2];
//Will take in either a song title or movie title depending on previous command
var movieSong = process.argv[3];

//Function to append data to .txt document
var writeLog = function(data) {
    fs.appendFile("log.txt", '\r\r');

    fs.appendFile("log.txt", JSON.stringify(data), function(err) {
        if (err) {
            console.log(err);
        }
        else
            console.log("random.txt updated");
    })
}

var retrieveTweets = function() {
    var client = new twitter(keys.twitterKeys);
    var parameters = {
        screen_name: '@rsmith1412',
        count: 20

    };

    client.get('statuses/user_timeline', parameters, function(error, tweets, response) {
        if(!error) {
            var data = [];
            for (var i = 0; i < tweets.length; i++) {
               data.push({
                   'created at: ' : tweets[i].created_at,
                   'Tweets: ' : tweets[i].text,
               }); 
            }
            console.log(data);
            writeLog(data);
        }
    });
};

var getArtistNames = function(artist) {
    return artist.name;
};

var getSpotify = function(songName) {
    if (songName === undefined) {
        songName = 'The Sign';
    };

    spotify.search({ type: 'track', query: songName}, function(err, data) {
        if(err) {
            console.log('Error Occured:' ) + err;
            return;
        }

        var songs = data.tracks.items;
        var data = [];

        for (var i = 0; i < songs.length; i++) {
            data.push({
                'artist(s): ': songs[i].artists.map(getArtistNames),
                'songName: ' : songs[i].name,
                'preview song: ' : songs[i].preview_url,
                'album : ' : songs[i].album.name,
            });
        }
        console.log("---------------------------------");
        console.log(data);
        console.log("---------------------------------");
        writeLog(data);
    });
};

var getMovie = function(movieName) {
    if (movieName === undefined) {
        movieName = 'Mr. Nobody';
    }

    var urlHit = "https://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json";

    request(urlHit, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = [];
            var jsonData = JSON.parse(body);

            data.push({
                'Title: ' : jsonData.Title,
                'Year: ' : jsonData.Year,
                'Rated: ' : jsonData.Rated,
                'IMDB Rating: ' : jsonData.imdbRating,
                'Country: ' : jsonData.Country,
                'Language: ' : jsonData.Language,
                'Plot: ' : jsonData.Plot,
                'Actors: ' : jsonData.Actors,
                'Rotten Tomatoes Rating: ' : jsonData.tomatoRating,
                'Rotten Tomatoes URL: ' : jsonData.tomatoURL,
            });
                console.log(data);
                writeLog(data);
        }
    });
}

var doItLiri = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);
        writeLog(data);
        var dataArray = data.split(',')

        if (dataArray.length == 2) {
            pick(dataArr[0], dataArr[1]);
        }

        else if (dataArr.length == 1) {
            pick (dataArr[0]);
        }

    });
}

var pick = function(caseData, functionData) {
    switch (caseData) {
        case 'my-tweets':
            retrieveTweets();
            break;
        
        case 'spotify-this-song':
            getSpotify(functionData);
            break;

        case 'movie-this':
            getMovie(functionData);
            break;
        
        case 'do-what-it-says' :
            doItLiri();
            break;

        default:
            console.log('LIRI does not undestand');
    }
}

var run = function(argOne, argTwo) {
    pick(argOne, argTwo);
};

run(command, movieSong);
