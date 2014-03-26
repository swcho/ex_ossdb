/**
 * Created by sungwoo on 14. 3. 26.
 */

import ossdb = require('../models/ossdb');

export function get_oss(req, res) {
    ossdb.Oss.all((err, data) => {
        console.log(data);
        res.json(data);
    });
};

export function get_license(req, res) {
    ossdb.License.all((err, data) => {
        console.log(data);
        res.json(data);
    });
};

export function get_package(req, res) {
    ossdb.Package.all((err, data) => {
        console.log(data);
        res.json(data);
    });
};

export function get_project(req, res) {
    ossdb.Project.all((err, data) => {
        console.log(data);
        res.json(data);
    });
};
