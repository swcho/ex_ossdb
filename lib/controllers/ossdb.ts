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

export function set_oss(req, res) {
    var id = req.params['id'];
    var oss = req.body;
    if (id) {
        oss.id = id;
        ossdb.set_oss(oss, (newOss) => {
            res.json(newOss);
        });
    } else {
        ossdb.set_oss(oss, (newOss) => {
            res.json(newOss);
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

export function set_license(req, res) {
    var id = req.params['id'];
    var license = req.body;
    if (id) {
        license.id = id;
        ossdb.set_license(license, (newLicense) => {
            res.json(newLicense);
        });
    } else {
        ossdb.set_license(license, (newLicense) => {
            res.json(newLicense);
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

export function set_package(req, res) {
    var id = req.params['id'];
    var pkg = req.body;
    if (id) {
        pkg.id = id;
        ossdb.set_license(pkg, (newPackage) => {
            res.json(newPackage);
        });
    } else {
        ossdb.set_license(pkg, (newPackage) => {
            res.json(newPackage);
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

export function set_project(req, res) {
    var id = req.params['id'];
    var project = req.body;
    if (id) {
        project.id = id;
        ossdb.set_license(project, (newProject) => {
            res.json(newProject);
        });
    } else {
        ossdb.set_license(project, (newProject) => {
            res.json(newProject);
        });
    }
}

export function SetProjectWithPackages(req, res) {
    ossdb.SetProjectWithPackages(req.body, (resp) => {
        res.json(resp);
    });
}
