var express = require('express');
var path = require('path');
var fs = require('fs');

var jugglingdb = require('jugglingdb');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./lib/config/config');

var jdb = new jugglingdb.Schema('sqlite3', {
    database: ':memory:',
    debug: true
});

jdb['log'] = function (a) {
    console.log(a);
};
jugglingdb['db'] = jdb;

var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
    if (/(.*)\.(js$|coffee$)/.test(file)) {
        require(modelsPath + '/' + file);
    }
});

require('./lib/config/dummydata2');

var passport = require('./lib/config/passport2');

var app = express();

require('./lib/config/express')(app);

require('./lib/routes')(app);

app.listen(config.port, function () {
    console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

exports = module.exports = app;
