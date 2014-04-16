var ossdb = require('../models/ossdb');
var async = require('async');

function get_oss(req, res) {
    var id = req.params['id'];
    if (id) {
        ossdb.get_oss_by_id(id, function (oss) {
            res.json(oss);
        });
    } else {
        ossdb.get_oss_all(function (ossList) {
            res.json(ossList);
        });
    }
}
exports.get_oss = get_oss;

function set_oss(req, res) {
    var id = req.params['id'];
    var oss = req.body;
    if (id) {
        oss.id = id;
        ossdb.set_oss(oss, function (newOss) {
            res.json(newOss);
        });
    } else {
        ossdb.set_oss(oss, function (newOss) {
            res.json(newOss);
        });
    }
}
exports.set_oss = set_oss;

function get_license(req, res) {
    var id = req.params['id'];
    if (id) {
        ossdb.get_license_by_id(id, function (license) {
            res.json(license);
        });
    } else {
        ossdb.get_license_all(function (licenseList) {
            res.json(licenseList);
        });
    }
}
exports.get_license = get_license;

function set_license(req, res) {
    var id = req.params['id'];
    var license = req.body;
    if (id) {
        license.id = id;
        ossdb.set_license(license, function (newLicense) {
            res.json(newLicense);
        });
    } else {
        ossdb.set_license(license, function (newLicense) {
            res.json(newLicense);
        });
    }
}
exports.set_license = set_license;

function get_package(req, res) {
    var id = req.params['id'];
    if (id) {
        ossdb.get_package_by_id(id, function (package) {
            res.json(package);
        });
    } else {
        ossdb.get_package_all(function (packageList) {
            res.json(packageList);
        });
    }
}
exports.get_package = get_package;

function set_package(req, res) {
    console.log('set_package');
    var id = req.params['id'];
    var pkg = req.body;
    console.log(id);
    console.log(pkg);
    if (id) {
        pkg.id = id;
        ossdb.set_package(pkg, function (newPackage) {
            console.log(newPackage);
            res.json(newPackage);
        });
    } else {
        ossdb.set_package(pkg, function (newPackage) {
            console.log(newPackage);
            res.json(newPackage);
        });
    }
}
exports.set_package = set_package;

function get_project(req, res) {
    var id = req.params['id'];
    if (id) {
        ossdb.get_project_by_id(id, function (project) {
            res.json(project);
        });
    } else {
        ossdb.get_project_all(function (projectList) {
            res.json(projectList);
        });
    }
}
exports.get_project = get_project;

function set_project(req, res) {
    var id = req.params['id'];
    var project = req.body;
    if (id) {
        project.id = id;
        ossdb.set_project(project, function (newProject) {
            res.json(newProject);
        });
    } else {
        ossdb.set_project(project, function (newProject) {
            res.json(newProject);
        });
    }
}
exports.set_project = set_project;

function SetProjectWithPackages(req, res) {
    ossdb.SetProjectWithPackages(req.body, function (resp) {
        res.json(resp);
    });
}
exports.SetProjectWithPackages = SetProjectWithPackages;
