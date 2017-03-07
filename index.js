// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
var parseServerConfig = require('parse-server-config');
var url = require('url');
var path = require('path');

var config = parseServerConfig(__dirname);

// var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

// if (!databaseUri) {
//   console.log('DATABASE_URI not specified, falling back to localhost.');
// }

// var api = new ParseServer({
//   databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
//   cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
//   appId: process.env.APP_ID || 'myAppId',
//   masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
//   serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
//   liveQuery: {
//     classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
//   }
// });
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/parse', new ParseServer(config.server));
app.use('/parse-dashboard', ParseDashboard(config.dashboard, true));

app.listen(process.env.PORT || url.parse(config.server.serverURL).port, function () {
  console.log(`Parse Server running a ${config.server.serverURL}`);
});

// Force https for security. Remove the following block if you want to allow htpp access
app.use(function (req, res, next) {
  if (req.headers['x-forwarded-proto'] == 'http') {
    res.redirect('https://' + req.headers.host + req.path);
  }
  else {
    return next();
  }
});

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

//