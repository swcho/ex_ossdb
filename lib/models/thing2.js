/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/jugglingdb/jugglingdb.d.ts" />
var jugglingdb = require('jugglingdb');

var db = jugglingdb['db'];

/**
* Thing Schema
*/
exports.Thing = db.define('Thing', {
    name: String,
    info: String,
    awesomeness: Number
});
//# sourceMappingURL=thing2.js.map
