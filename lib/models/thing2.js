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
/**
* Validations
*/
//ThingSchema.path('awesomeness').validate(function (num) {
//    return num >= 1 && num <= 10;
//}, 'Awesomeness must be between 1 and 10');
//mongoose.model<TThing>('Thing', ThingSchema);
//# sourceMappingURL=thing2.js.map
