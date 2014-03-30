/**
* Created by sungwoo on 14. 3. 25.
*/
/// <reference path="../../typings/jugglingdb/jugglingdb.d.ts" />
/// <reference path="../../typings/async/async.d.ts" />
var jugglingdb = require('jugglingdb');
var async = require('async');

var db = jugglingdb['db'];
console.log(process.cwd());

exports.Oss = db.define('Oss', {
    name: { type: String, index: true },
    projectUrl: String
});

exports.License = db.define('License', {
    name: { type: String, index: true },
    type: String
});

exports.Package = db.define('Package', {
    name: { type: String, index: true }
});

exports.Project = db.define('Project', {
    projectId: { type: String, index: true }
});

exports.PackageUsage = db.define('PackageUsage', {});

//db.autoupdate();
exports.Oss.hasMany(exports.Package, { as: 'getPackages', foreignKey: 'ossId' });

//Oss.hasMany(Package);
exports.License.hasMany(exports.Package, { as: 'getPackages', foreignKey: 'licenseId' });
exports.Project.hasMany(exports.PackageUsage, { as: 'getUsages', foreignKey: 'projectId' });
exports.Package.hasMany(exports.PackageUsage, { as: 'getUsages', foreignKey: 'packageId' });

//PackageUsage.belongsTo(Project);
//PackageUsage.belongsTo(Package);
function set_fixture(done) {
    var fit_Oss = [
        {
            name: 'OpenSSL',
            projectUrl: "http://www.openssl.org/"
        }, {
            name: 'libpng',
            projectUrl: "http://www.libpng.org/pub/png/libpng.html"
        }, {
            name: 'libzip',
            projectUrl: "http://www.nih.at/libzip/"
        }];

    var fit_license = [
        {
            name: 'GNU General Public License (GPLv2)',
            type: 'Reciprocal'
        }, {
            name: 'GNU Library or Lesser General Public License (LGPLv2)',
            type: 'Reciprocal'
        }];

    var fit_package = [
        {
            name: 'libopenssl.1.0.0.so'
        }, {
            name: 'libopenssl.1.0.1.so'
        }, {
            name: 'libopenssl.1.0.2.so'
        }, {
            name: 'libpng.1.0.1.so'
        }];

    var fit_project = [
        {
            projectId: 'project_acme'
        }, {
            projectId: 'project_andromeda'
        }];

    var fit_relation_package = [
        {
            ossId: 1,
            licenseId: 2
        }, {
            ossId: 1,
            licenseId: 2
        }, {
            ossId: 1,
            licenseId: 1
        }, {
            ossId: 2,
            licenseId: 1
        }];

    var fit_relation_packageUsage = [
        {
            projectId: 1,
            packageId: 1
        }, {
            projectId: 1,
            packageId: 2
        }, {
            projectId: 2,
            packageId: 1
        }];

    var series = [];
    var newOss;
    var newLicense;
    var newPackages;
    var newProject;
    series.push(function (cb) {
        console.log('1');
        db.automigrate(cb);
    });
    series.push(function (cb) {
        console.log('2');
        exports.Oss.create(fit_Oss, function (err, model) {
            console.log(err);
            console.log(model);
            newOss = model;
            cb();
        });
    });
    series.push(function (cb) {
        console.log('3');
        exports.License.create(fit_license, function (err, model) {
            newLicense = model;
            cb();
        });
    });
    series.push(function (cb) {
        console.log('4');
        exports.Package.create(fit_package, function (err, model) {
            newPackages = model;
            cb();
        });
    });
    series.push(function (cb) {
        console.log('5');
        exports.Project.create(fit_project, function (err, model) {
            newProject = model;
            cb();
        });
    });
    series.push(function (cb) {
        console.log('6');
        var s = [];
        newPackages.forEach(function (p, i) {
            s.push(function (cb) {
                p.updateAttributes(fit_relation_package[i], cb);
            });
        });
        s.push(function () {
            cb();
        });
        async.series(s);
    });
    series.push(function (cb) {
        console.log('7');
        var s = [];
        fit_relation_packageUsage.forEach(function (usage) {
            var newUsage = exports.PackageUsage.create({
                'projectId': usage.projectId,
                'packageId': usage.packageId
            }, cb);
            //            newUsage.updateAttributes(, cb);
            //newUsage.save(cb);
        });
        s.push(function () {
            cb();
        });
        async.series(s);
    });
    series.push(function (cb) {
        console.log('prepare done');
        done();
    });
    async.series(series);
    return {
        oss: fit_Oss,
        license: fit_license,
        package: fit_package,
        project: fit_project
    };
}
exports.set_fixture = set_fixture;

function get_oss_by_id(aId, aCb) {
    exports.Oss.find(aId, function (err, oss) {
        oss.getPackages(function (err, packages) {
            oss.packages = packages;
            aCb(oss);
        });
    });
}
exports.get_oss_by_id = get_oss_by_id;

function get_oss_all(aCb) {
    exports.Oss.all(function (err, ossList) {
        var s = [];
        ossList.forEach(function (oss) {
            s.push(function (cb) {
                oss.getPackages(function (err, packages) {
                    oss.packages = packages;
                    cb();
                });
            });
        });
        s.push(function (cb) {
            aCb(ossList);
            cb();
        });
        async.series(s);
    });
}
exports.get_oss_all = get_oss_all;

function set_oss(aOss, aCb) {
    exports.Oss.upsert(aOss, function (err, oss) {
        aCb(oss);
    });
}
exports.set_oss = set_oss;

function get_license_by_id(aId, aCb) {
    exports.License.find(aId, function (err, license) {
        license.getPackages(function (err, packages) {
            license.packages = packages;
            aCb(license);
        });
    });
}
exports.get_license_by_id = get_license_by_id;

function get_license_all(aCb) {
    exports.License.all(function (err, licenseList) {
        var s = [];
        licenseList.forEach(function (license) {
            s.push(function (cb) {
                license.getPackages(function (err, packages) {
                    license.packages = packages;
                    cb();
                });
            });
        });
        s.push(function (cb) {
            aCb(licenseList);
            cb();
        });
        async.series(s);
    });
}
exports.get_license_all = get_license_all;

function populate_package(aPackage, aCb) {
    exports.Oss.find(aPackage.ossId, function (err, oss) {
        aPackage.oss = oss;
        exports.License.find(aPackage.licenseId, function (err, license) {
            aPackage.license = license;
            aPackage.getUsages(function (err, usages) {
                var projects = [];
                var series = [];
                usages.forEach(function (usage) {
                    series.push(function (cb) {
                        exports.Project.find(usage.projectId, function (err, project) {
                            console.log(project);
                            projects.push(project);
                            cb();
                        });
                    });
                });
                series.push(function (cb) {
                    aPackage.projects = projects;
                    aCb();
                    cb();
                });
                async.series(series);
            });
        });
    });
}

function get_package_by_id(aId, aCb) {
    exports.Package.find(aId, function (err, package) {
        populate_package(package, function () {
            aCb(package);
        });
    });
}
exports.get_package_by_id = get_package_by_id;

function get_package_by_name(aName, aCb) {
    exports.Package.findOne({
        where: {
            name: aName
        }
    }, function (err, package) {
        aCb(package);
    });
}
exports.get_package_by_name = get_package_by_name;

function get_package_all(aCb, aDoNotPopulate) {
    exports.Package.all(function (err, packageList) {
        if (aDoNotPopulate) {
            aCb(packageList);
        } else {
            var s = [];
            packageList.forEach(function (package) {
                s.push(function (cb) {
                    populate_package(package, cb);
                });
            });
            s.push(function (cb) {
                console.log(packageList);
                aCb(packageList);
                cb();
            });
            async.series(s);
        }
    });
}
exports.get_package_all = get_package_all;

function populate_project(aProject, aCb) {
    aProject.getUsages(function (err, usages) {
        var packages = [];
        var series = [];
        usages.forEach(function (usage) {
            series.push(function (cb) {
                exports.Package.find(usage.packageId, function (err, package) {
                    packages.push(package);
                    cb();
                });
            });
        });
        series.push(function (cb2) {
            aProject.packages = packages;
            aCb();
            cb2();
        });
        async.series(series);
    });
}

function get_project_by_id(aId, aCb) {
    exports.Project.find(aId, function (err, project) {
        populate_project(project, function () {
            aCb(project);
        });
    });
}
exports.get_project_by_id = get_project_by_id;

function get_project_by_projectId(aProjectId, aCb) {
    exports.Project.findOne({
        where: {
            projectId: aProjectId
        }
    }, function (err, project) {
        if (project) {
            populate_project(project, function () {
                aCb(project);
            });
        } else {
            aCb(null);
        }
    });
}
exports.get_project_by_projectId = get_project_by_projectId;

function get_project_all(aCb) {
    exports.Project.all(function (err, projectList) {
        var s = [];
        projectList.forEach(function (project) {
            s.push(function (cb) {
                populate_project(project, cb);
            });
        });
        s.push(function (cb) {
            aCb(projectList);
            cb();
        });
        async.series(s);
    });
}
exports.get_project_all = get_project_all;

function SetProjectWithPackages(aParam, aCb) {
    var packagesByName = {};
    var project;
    var newProject;
    var resp = {
        ok: false,
        projectAdded: false,
        projectUpdated: false,
        packageNamesCreated: [],
        packageNamesAdded: [],
        packageNamesRemoved: []
    };

    var series = [];

    // get packages
    series.push(function (cb) {
        exports.get_package_all(function (packageList) {
            packageList.forEach(function (p) {
                packagesByName[p.name] = p;
            });
            cb();
        }, true);
    });

    // get previous project item
    series.push(function (cb) {
        exports.get_project_by_projectId(aParam.projectId, function (p) {
            project = p;
            console.log('get previous project item');
            console.log(p);
            cb();
        });
    });

    // add new project if previous project item does not exist
    series.push(function (cb) {
        if (!project) {
            console.log('set new project if previous project item does not exist');
            exports.Project.create({
                projectId: aParam.projectId
            }, function (err, p) {
                newProject = p;
                console.log(p);
                resp.projectAdded = true;
                cb();
            });
        } else {
            cb();
        }
    });

    // set packages
    series.push(function (cb) {
        var newPackages = [];
        var newPackageNames = [];
        var packageNames = Object.keys(packagesByName);
        aParam.packageNames.forEach(function (name) {
            if (packageNames.indexOf(name) == -1) {
                newPackages.push({
                    name: name
                });
                newPackageNames.push(name);
            }
        });
        exports.Package.create(newPackages, function (err) {
            console.log('set packages');
            resp.packageNamesCreated = newPackageNames;

            // update package list
            exports.get_package_all(function (packageList) {
                packageList.forEach(function (p) {
                    packagesByName[p.name] = p;
                });
                cb();
            }, true);
        });
    });

    // add packages to project
    series.push(function (cb) {
        if (project) {
            if (project.packages) {
                console.log('has packages');
                console.log(project.packages);

                var packageNames = [];
                project.packages.forEach(function (p) {
                    packageNames.push(p.name);
                });

                var usagesToBeAdded = [];
                var requestedPackageNames = [];
                aParam.packageNames.forEach(function (name) {
                    usagesToBeAdded.push({
                        projectId: project.id,
                        packageId: packagesByName[name].id
                    });
                    if (packageNames.indexOf(name) == -1) {
                        //                        usagesToBeAdded.push({
                        //                            projectId: newProject.id,
                        //                            packageId: packagesByName[name].id
                        //                        });
                        resp.packageNamesAdded.push(name);
                    }
                    requestedPackageNames.push(name);
                });

                //                var usagesToBeRemoved = [];
                project.packages.forEach(function (p) {
                    if (requestedPackageNames.indexOf(p.name) == -1) {
                        //                        usagesToBeRemoved.push(p.id);
                        resp.packageNamesRemoved.push(p.name);
                    }
                });

                exports.PackageUsage.all({
                    where: {
                        projectId: project.id
                    }
                }, function (err, usages) {
                    console.log(err);
                    console.log(usages);
                    console.log(typeof usages);

                    var series = [];
                    usages.forEach(function (u) {
                        series.push(function (cb) {
                            u.destroy(cb);
                        });
                    });
                    series.push(function (cb) {
                        exports.PackageUsage.create(usagesToBeAdded, function (err, usages) {
                            console.log('Usages');
                            console.log(usages);
                            cb();
                        });
                    });
                    series.push(function (cb2) {
                        cb2();
                        cb();
                    });
                    async.series(series);
                });
                resp.projectUpdated = true;
            } else {
                cb();
            }
        } else {
            var usages = [];
            aParam.packageNames.forEach(function (name) {
                usages.push({
                    projectId: newProject.id,
                    packageId: packagesByName[name].id
                });
                resp.packageNamesAdded.push(name);
            });
            exports.PackageUsage.create(usages, function (err, usages) {
                console.log('Usages');
                console.log(usages);
                cb();
            });
        }
    });

    // finalize
    series.push(function (cb) {
        resp.ok = true;
        aCb(resp);
        cb();
    });

    async.series(series);
}
exports.SetProjectWithPackages = SetProjectWithPackages;
//# sourceMappingURL=ossdb.js.map
