/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/express/express.d.ts" />
/// <reference path="typings/mongoose/mongoose.d.ts" />
/// <reference path="typings/jugglingdb/jugglingdb.d.ts" />

import express = require('express');
import path = require('path');
import fs = require('fs');
//import mongoose = require('mongoose');

import jugglingdb = require('jugglingdb');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config: any = require('./lib/config/config');


if( process.env.NODE_ENV == 'production' ) {

    var jdb = new jugglingdb.Schema('mongodb', {
        url: 'mongodb://localhost/ossdb',
        w: 1,
        j: 1
    });
    jdb['log'] = function (a) { console.log(a); };

} else {

    var jdb = new jugglingdb.Schema('sqlite3', {
//    database: './ossdb.sqlite3',
        database: ':memory:',
        debug: true
    });
}

jugglingdb['db'] = jdb;

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
    if (/(.*)\.(js$|coffee$)/.test(file)) {
        require(modelsPath + '/' + file);
    }
});

if( process.env.NODE_ENV == 'development' ) {
    // Populate empty DB with sample data
    require('./lib/config/dummydata');
}

// Passport Configuration
var passport = require('./lib/config/passport');

var app = express();

express.Application

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
