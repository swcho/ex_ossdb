/**
* Created by sungwoo on 14. 3. 25.
*/
/// <reference path="../../typings/jugglingdb/jugglingdb.d.ts" />
/// <reference path="../../typings/async/async.d.ts" />
var jugglingdb = require('jugglingdb');
var async = require('async');

exports.db = new jugglingdb.Schema('sqlite3', {
    database: 'ossdb.sqlite3',
    debug: true
});

exports.Oss = exports.db.define('Oss', {
    name: { type: String, index: true },
    projectUrl: String
});

exports.License = exports.db.define('License', {
    name: { type: String, index: true },
    type: String
});

exports.Package = exports.db.define('Package', {
    name: { type: String, index: true }
});

exports.Project = exports.db.define('Project', {
    projectId: { type: String, index: true }
});

exports.PackageUsage = exports.db.define('PackageUsage', {});

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
            projectId: 'hms1000sph2'
        }, {
            projectId: 'hdr1000s'
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
        exports.db.automigrate(cb);
    });
    series.push(function (cb) {
        exports.Oss.create(fit_Oss, function (err, model) {
            newOss = model;
            cb();
        });
    });
    series.push(function (cb) {
        exports.License.create(fit_license, function (err, model) {
            newLicense = model;
            cb();
        });
    });
    series.push(function (cb) {
        exports.Package.create(fit_package, function (err, model) {
            newPackages = model;
            cb();
        });
    });
    series.push(function (cb) {
        exports.Project.create(fit_project, function (err, model) {
            newProject = model;
            cb();
        });
    });
    series.push(function (cb) {
        var s = [];
        newPackages.forEach(function (p, i) {
            s.push(function (cb) {
                console.log('set package relation');
                p.updateAttributes(fit_relation_package[i], cb);
            });
        });
        s.push(function () {
            cb();
        });
        async.series(s);
    });
    series.push(function (cb) {
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
//# sourceMappingURL=ossdb.js.map
