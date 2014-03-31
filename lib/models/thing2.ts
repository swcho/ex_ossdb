/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/jugglingdb/jugglingdb.d.ts" />

import jugglingdb = require('jugglingdb');

var db: jugglingdb.Schema = jugglingdb['db'];

export interface TThing {
    name: string;
    info: string;
    awesomeness: number;
}

/**
 * Thing Schema
 */
export var Thing = db.define<TThing>('Thing', {
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
