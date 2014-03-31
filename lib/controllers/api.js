var thing2 = require('../models/thing2');

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
