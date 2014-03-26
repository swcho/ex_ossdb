var ossdb = require('../models/ossdb');

function get_oss(req, res) {
    ossdb.Oss.all(function (err, data) {
        console.log(data);
        res.json(data);
    });
}
exports.get_oss = get_oss;
;

function get_license(req, res) {
    ossdb.License.all(function (err, data) {
        console.log(data);
        res.json(data);
    });
}
exports.get_license = get_license;
;

function get_package(req, res) {
    ossdb.Package.all(function (err, data) {
        console.log(data);
        res.json(data);
    });
}
exports.get_package = get_package;
;

function get_project(req, res) {
    ossdb.Project.all(function (err, data) {
        console.log(data);
        res.json(data);
    });
}
exports.get_project = get_project;
;
