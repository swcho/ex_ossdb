var jugglingdb = require('jugglingdb');

var db = jugglingdb['db'];

exports.Thing = db.define('Thing', {
    name: String,
    info: String,
    awesomeness: Number
});
