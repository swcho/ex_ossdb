var express = require('express');
var path = require('path');
var fs = require('fs');

var jugglingdb = require('jugglingdb');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./lib/config/config');

if (process.env.NODE_ENV == 'production') {
    var jdb = new jugglingdb.Schema('mongodb', {
        url: 'mongodb://localhost/ossdb',
        w: 1,
        j: 1
    });
    jdb['log'] = function (a) {
        console.log(a);
    };
} else {
    var jdb = new jugglingdb.Schema('sqlite3', {
        database: ':memory:',
        debug: true
    });
}

jugglingdb['db'] = jdb;

var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
    if (/(.*)\.(js$|coffee$)/.test(file)) {
        require(modelsPath + '/' + file);
    }
});

if (process.env.NODE_ENV == 'development') {
    require('./lib/config/dummydata');
}

var passport = require('./lib/config/passport');

var app = express();

express.Application;

require('./lib/config/express')(app);

require('./lib/routes')(app);

app.listen(config.port, function () {
    console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

exports = module.exports = app;
