const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
const auth = require('./private/spotify-auth');

const app = express();
const spotify = new SpotifyWebApi();

console.log(auth);

// uses
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressLayouts);

// sets
app.set('layout', 'layouts/main');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');




/** * SPOTIFY AUTHENTIFICATION
 */

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi(auth);

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it’s used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);

    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    });

app.get('/', (req, res) => {

    res.render('index');
});

app.post('/artists', (req, res, next) => {

    spotifyApi.searchArtists(req.body.artist, {}, (err, data) => {
        if (err) throw err;

        let artists = data.body.artists.items;

        res.render('artists', { artists });
    });

});


app.get('/albums/:artistId', (req, res, next) => {

    spotifyApi.getArtistAlbums(req.params.artistId, {}, (err, data) => {
        if (err) throw err;

        let albums = data.body.items;

        res.render('albums', { albums });
    });

});

app.get('/tracks/:albumId', (req, res, next) => {

    spotifyApi.getAlbumTracks(req.params.albumId, {}, (err, data) => {
        if (err) throw err;

        let tracks = data.body.items;

        res.render('tracks', { tracks });
    });

});






app.listen(3000, () => {
    console.log('listening on port 3000');
});

