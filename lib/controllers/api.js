var thing = require('../models/thing');

function awesomeThings(req, res) {
    return thing.Thing.all(function (err, things) {
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
