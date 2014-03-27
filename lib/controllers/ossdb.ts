/**
 * Created by sungwoo on 14. 3. 26.
 */

/// <reference path="../../typings/async/async.d.ts" />

import ossdb = require('../models/ossdb');
import async = require('async');

export function get_oss(req, res) {
    var id = req.params['id'];
    if (id) {
        ossdb.get_oss_by_id(id, (oss) => {
            res.json(oss);
        });
    } else {
        ossdb.get_oss_all((ossList) => {
            res.json(ossList);
        });
    }
}

export function get_license(req, res) {
    var id = req.params['id'];
    if (id) {
        ossdb.get_license_by_id(id, (license) => {
            res.json(license);
        });
    } else {
        ossdb.get_license_all((licenseList) => {
            res.json(licenseList);
        });
    }
}

export function get_package(req, res) {
    var id = req.params['id'];
    if (id) {
        ossdb.get_package_by_id(id, (package) => {
            res.json(package);
        });
    } else {
        ossdb.get_package_all((packageList) => {
            res.json(packageList);
        });
    }
}

export function get_project(req, res) {
    var id = req.params['id'];
    if (id) {
        ossdb.get_project_by_id(id, (project) => {
            res.json(project);
        });
    } else {
        ossdb.get_project_all((projectList) => {
            res.json(projectList);
        });
    }
}
