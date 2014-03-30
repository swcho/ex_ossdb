/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/express/express.d.ts" />
/// <reference path="typings/mongoose/mongoose.d.ts" />
/// <reference path="typings/jugglingdb/jugglingdb.d.ts" />
var express = require('express');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');

var jugglingdb = require('jugglingdb');

/**
* Main application file
*/
// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

// Connect to database
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

var jdb = new jugglingdb.Schema('sqlite3', {
    database: './ossdb.sqlite3',
    //    database: ':memory:',
    debug: true
});

jdb['log'] = function (a) {
    console.log(a);
};
jugglingdb['db'] = jdb;

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
    if (/(.*)\.(js$|coffee$)/.test(file)) {
        require(modelsPath + '/' + file);
    }
});

// Populate empty DB with sample data
require('./lib/config/dummydata');

// Passport Configuration
var passport = require('./lib/config/passport');

var app = express();

// Express settings
require('./lib/config/express')(app);

// Routing
require('./lib/routes')(app);

// Start server
app.listen(config.port, function () {
    console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
//# sourceMappingURL=server.js.map
