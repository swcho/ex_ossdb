var ossdb = require('../models/ossdb');
var async = require('async');

function SetProjectWithPackages(req, res) {
    ossdb.SetProjectWithPackages(req.body, function (resp) {
        res.json(resp);
    });
}
exports.SetProjectWithPackages = SetProjectWithPackages;
