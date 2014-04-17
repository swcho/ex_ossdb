/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/mongoose/mongoose.d.ts" />
//import mongoose = require('mongoose');
var thing2 = require('../models/thing2');

//var Thing = mongoose.model<thing.TThing>('Thing');
/**
* Get awesome things
*/
function awesomeThings(req, res) {
    return thing2.Thing.all(function (err, things) {
        console.log(things);
        if (!err) {
            return res.json(things);
        } else {
            return res.send(err);
        }
    });
}
exports.awesomeThings = awesomeThings;
;
//# sourceMappingURL=api.js.map
