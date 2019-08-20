const axios = require('axios');
const Spotify = require('node-spotify-api');
const moment = require('moment');
const readline = require('readline');
const input1 = process.argv[2];
const input2 = process.argv[3];
const input3 = process.argv[4];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const log = console.log;
var typeOfSearch = () => {
  log('--------------------------------');
  rl.question(
    'Would you like to search a movie, song, or concert locations?',
    answer => {
      log(answer);
      if (answer === 'exit') {
        return rl.close();
      }

      if (answer === 'movie' || answer === 'song' || answer === 'concert') {
        log(`okay! So we are searching for a ${answer}, no problem!.....7_7`);
        switch (answer) {
          case 'song':
            log('--------------------------------');
            songSearcher();
            break;
        }
      } else {
        log('--------------------------------');
        log(
          'Sorry you need to type wether you are looking for a song, movie or concert, and make sure your spelling is right'
        );
        typeOfSearch();
      }
    }
  );
};

//search spotify
function spotifySearch(title, type) {
  let spotify = new Spotify({
    id: '5ebda250f1934294a11339a7364ff2b8',
    secret: 'd9da14497d574143bf8fd7c608bfe0a3'
  });

  spotify
    .request(`https://api.spotify.com/v1/search?q=${title}&type=${type}`)
    .then(function(response) {
      log('---------SONGS-------');
      for (let i = 0; i < response.tracks.items.length; i++) {
        log(
          response.tracks.items[i].artists[0].name +
            ' - ' +
            response.tracks.items[i].name
        );
      }
      rl.question('Did you find your song? yes/no: ', answer => {
        if (answer === 'yes') {
          log('--------------------------------');

          log(
            'Awesome! glad to help you, taking you back to search for something different'
          );
          typeOfSearch();
        } else if (answer === 'no') {
          log('--------------------------------');
          rl.question("I'm so sorry, try again/menu ?", answer => {
            if (answer === 'again') {
              songSearcher();
            } else if (answer === 'menu') {
              typeOfSearch();
            } else {
              log('invalid command');
            }
          });
        }
      });
    })
    .catch(function(err) {
      log('No results for songs');
      log(err);
    });
}

function movieSearch() {
  let movieName = input2;
  var queryUrl = 'http://www.omdbapi.com/?t=' + movieName + '&apikey=c7572ae8';
  axios
    .get(queryUrl)
    .then(function(response) {
      log('--------MOVIE-------');
      log(response.data);
      log(response.data.Title);
      log('Actors: ' + response.data.Actors);
      log('Plot: ' + response.data.Plot);
      log('IMDB Rating: ' + response.data.imdbRating);
    })
    .catch(() => {
      log('no Results found for mivies');
    });
}
function songSearcher() {
  rl.question(
    'whats the title? (No worries type no if you do not know): ',
    answer => {
      log('--------------------------------');
      if (answer !== 'no') {
        let searchQuery;
        searchQuery = answer;

        if (/\s/.test(answer)) {
          //regex:if there are spaces in typing...then...fillthe white spaces with '%20'
          searchQuery = answer.replace(/\s/g, '%20');
        }
        spotifySearch(searchQuery, 'track');
      } else {
        rl.question(
          'Search by artist (No worries type no if you do not know): ',
          answer => {
            spotifySearch(answer, 'artist');
          }
        );
      }
    }
  );
}

typeOfSearch();
