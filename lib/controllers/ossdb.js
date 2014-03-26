var ossdb = require('../models/ossdb');
var async = require('async');

function get_oss(req, res) {
    ossdb.Oss.all(function (err, data) {
        var s = [];
        data.forEach(function (oss) {
            s.push(function (cb) {
                oss.getPackages(function (err, packages) {
                    console.log(packages);
                    oss.packages = packages;
                    cb();
                });
            });
        });
        s.push(function (cb) {
            console.log(data);
            res.json(data);
        });
        async.series(s);
    });
}
exports.get_oss = get_oss;
;

function get_license(req, res) {
    ossdb.License.all(function (err, data) {
        var s = [];
        data.forEach(function (license) {
            s.push(function (cb) {
                license.getPackages(function (err, packages) {
                    license.packages = packages;
                    cb();
                });
            });
        });
        s.push(function (cb) {
            console.log(data);
            res.json(data);
            cb();
        });
        async.series(s);
    });
}
exports.get_license = get_license;
;

function get_package(req, res) {
    ossdb.Package.all(function (err, data) {
        var s = [];
        data.forEach(function (package) {
            s.push(function (cb) {
                package.getUsages(function (err, usages) {
                    console.log(usages);
                    var projects = [];
                    var s2 = [];
                    usages.forEach(function (usage) {
                        s2.push(function (cb) {
                            ossdb.Project.find(usage.projectId, function (err, project) {
                                console.log(project);
                                projects.push(project);
                                cb();
                            });
                        });
                    });
                    s2.push(function (cb2) {
                        package.projects = projects;
                        cb2();
                        cb();
                    });
                    async.series(s2);
                });
            });
        });
        s.push(function (cb) {
            console.log(data);
            res.json(data);
            cb();
        });
        async.series(s);
    });
}
exports.get_package = get_package;
;

function get_project(req, res) {
    ossdb.Project.all(function (err, projects) {
        var s = [];
        projects.forEach(function (project) {
            s.push(function (cb) {
                project.getUsages(function (err, usages) {
                    var packages = [];
                    var s2 = [];
                    usages.forEach(function (usage) {
                        s2.push(function (cb) {
                            ossdb.Package.find(usage.packageId, function (err, package) {
                                packages.push(package);
                                cb();
                            });
                        });
                    });
                    s2.push(function (cb2) {
                        project.packages = packages;
                        cb();
                        cb2();
                    });
                    async.series(s2);
                });
            });
        });
        s.push(function (cb) {
            res.json(projects);
            cb();
        });
        async.series(s);
    });
}
exports.get_project = get_project;
;
