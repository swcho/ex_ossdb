/**
 * Created by sungwoo on 14. 3. 26.
 */

/// <reference path="../../typings/async/async.d.ts" />

import ossdb = require('../models/ossdb');
import async = require('async');

export function get_oss(req, res) {
    var id = req.params.id;
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
    ossdb.License.all((err, data) => {
        var s = [];
        data.forEach((license) => {
            s.push((cb) => {
                license.getPackages((err, packages) => {
                    license.packages = packages;
                    cb();
                });
            });
        });
        s.push((cb) => {
            console.log(data);
            res.json(data);
            cb();
        });
        async.series(s);
    });
};

export function get_package(req, res) {
    ossdb.Package.all((err, data) => {
        var s = [];
        data.forEach((package) => {
            s.push((cb) => {
                package.getUsages((err, usages) => {
                    console.log(usages);
                    var projects = [];
                    var s2 = [];
                    usages.forEach((usage) => {
                        s2.push((cb) => {
                            ossdb.Project.find(usage.projectId, (err, project) => {
                                console.log(project);
                                projects.push(project);
                                cb();
                            });
                        })
                    });
                    s2.push((cb2) => {
                        package.projects = projects;
                        cb2();
                        cb();
                    });
                    async.series(s2);
                });
            });
        });
        s.push((cb) => {
            console.log(data);
            res.json(data);
            cb();
        });
        async.series(s);
    });
};

export function get_project(req, res) {
    ossdb.Project.all((err, projects) => {
        var s = [];
        projects.forEach((project) => {
            s.push((cb) => {
                project.getUsages((err, usages) => {
                    var packages = [];
                    var s2 = [];
                    usages.forEach((usage) => {
                        s2.push((cb) => {
                            ossdb.Package.find(usage.packageId, (err, package) => {
                                packages.push(package);
                                cb();
                            });
                        });
                    });
                    s2.push((cb2) => {
                        project.packages = packages;
                        cb();
                        cb2();
                    });
                    async.series(s2);
                });
            });
        });
        s.push((cb) => {
            res.json(projects);
            cb();
        });
        async.series(s);
    });
};
