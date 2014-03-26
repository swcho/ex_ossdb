var ossdb = require('../models/ossdb');

function get_oss(req, res) {
    ossdb.Oss.all(function (err, data) {
        console.log(data);
        res.json(data);
    });
}
exports.get_oss = get_oss;
;
