var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var jugglingdb = require('jugglingdb');
var async = require('async');
var model = require('./model');

var db = jugglingdb['db'];
console.log(process.cwd());

var CModelOss = (function (_super) {
    __extends(CModelOss, _super);
    function CModelOss(aDb) {
        _super.call(this, aDb, 'Oss', {
            'name': { type: String, index: true },
            'projectUrl': String
        }, 'name');
    }
    CModelOss.prototype._populateItem = function (aItem, aCb) {
        aItem.getPackages(function (err, packages) {
            aItem.packages = packages;
            aCb(err, aItem);
        });
    };
    return CModelOss;
})(model.CModel);
exports.CModelOss = CModelOss;

var CModelLicense = (function (_super) {
    __extends(CModelLicense, _super);
    function CModelLicense(aDb) {
        _super.call(this, aDb, 'License', {
            name: { type: String, index: true },
            type: String
        }, 'name');
    }
    CModelLicense.prototype._populateItem = function (aItem, aCb) {
        aItem.getPackages(function (err, packages) {
            aItem.packages = packages;
            aCb(err, aItem);
        });
    };
    return CModelLicense;
})(model.CModel);
exports.CModelLicense = CModelLicense;

var CModelPackage = (function (_super) {
    __extends(CModelPackage, _super);
    function CModelPackage(aDb) {
        _super.call(this, aDb, 'Package', {
            name: { type: String, index: true },
            type: String
        }, 'name');
    }
    CModelPackage.prototype._populateItem = function (aItem, aCb) {
        aItem.getOss(function (err, oss) {
            aItem.oss = oss;
            aItem.getLicense(function (err, license) {
                aItem.license = license;
                aItem.getUsages(function (err, usages) {
                    var projects = [];
                    var series = [];
                    usages.forEach(function (usage) {
                        series.push(function (cb) {
                            usage.getProject(function (err, project) {
                                projects.push(project);
                                cb();
                            });
                        });
                    });
                    series.push(function (cb) {
                        aItem.projects = projects;
                        aCb(err, aItem);
                        cb();
                    });
                    async.series(series);
                });
            });
        });
    };
    return CModelPackage;
})(model.CModel);
exports.CModelPackage = CModelPackage;

var CModelProject = (function (_super) {
    __extends(CModelProject, _super);
    function CModelProject(aDb) {
        _super.call(this, aDb, 'Project', {
            projectId: { type: String, index: true }
        }, 'projectId');
    }
    CModelProject.prototype._populateItem = function (aItem, aCb) {
        aItem.getUsages(function (err, usages) {
            var packages = [];
            var series = [];
            usages.forEach(function (usage) {
                series.push(function (cb) {
                    usage.getPackage(function (err, package) {
                        packages.push(package);
                        cb();
                    });
                });
            });
            series.push(function (cb) {
                aItem.packages = packages;
                aCb(err, aItem);
                cb();
            });
            async.series(series);
        });
    };
    CModelProject.prototype.getByProjectId = function (aProjectId, aCb) {
        var _this = this;
        this.model().findOne({
            where: {
                projectId: aProjectId
            }
        }, function (err, project) {
            if (project) {
                _this._populateItem(project, function (err) {
                    aCb(err, project);
                });
            } else {
                aCb(err, null);
            }
        });
    };
    return CModelProject;
})(model.CModel);
exports.CModelProject = CModelProject;

exports.modelOss = new CModelOss(db);
exports.modelLicense = new CModelLicense(db);
exports.modelPackage = new CModelPackage(db);
exports.modelProject = new CModelProject(db);

exports.Oss = exports.modelOss.model();

exports.License = exports.modelLicense.model();

exports.Package = exports.modelPackage.model();

exports.Project = exports.modelProject.model();

exports.PackageUsage = db.define('PackageUsage', {
    projectId: { type: String, index: true },
    packageId: { type: String, index: true }
});

exports.Oss.hasMany(exports.Package, { as: 'getPackages', foreignKey: 'ossId' });
exports.Package.belongsTo(exports.Oss, { as: 'getOss', foreignKey: 'ossId' });

exports.License.hasMany(exports.Package, { as: 'getPackages', foreignKey: 'licenseId' });
exports.Package.belongsTo(exports.License, { as: 'getLicense', foreignKey: 'licenseId' });

exports.Project.hasMany(exports.PackageUsage, { as: 'getUsages', foreignKey: 'projectId' });
exports.PackageUsage.belongsTo(exports.Project, { as: 'getProject', foreignKey: 'projectId' });

exports.Package.hasMany(exports.PackageUsage, { as: 'getUsages', foreignKey: 'packageId' });
exports.PackageUsage.belongsTo(exports.Package, { as: 'getPackage', foreignKey: 'packageId' });

function set_fixture(done) {
    db.automigrate(done);
    return;

    var i, iLen, j, jLen;

    var fit_Oss = [];
    var fit_package = [];
    var fit_relation_package = [];

    iLen = 20;
    jLen = 20;
    var oss_name;
    for (i = 0; i < iLen; i++) {
        oss_name = 'Oss_' + i;
        fit_Oss.push({
            name: oss_name,
            projectUrl: 'http://www.oss.com/' + i
        });
        for (j = 0; j < jLen; j++) {
            fit_package.push({
                name: oss_name + '.' + j + '.so',
                type: 'lib'
            });
            fit_relation_package.push({
                ossId: i + 1,
                licenseId: j + 1
            });
        }
    }

    var fit_license = [];
    iLen = 20;
    for (i = 0; i < iLen; i++) {
        fit_license.push({
            name: 'License ' + i,
            type: 'Type ' + i
        });
    }

    var fit_project = [];
    iLen = 20;
    for (i = 0; i < iLen; i++) {
        fit_project.push({
            projectId: 'Project ' + i
        });
    }

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
                projectId: usage.projectId,
                packageId: usage.packageId
            }, cb);
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

function SetProjectWithPackages(aParam, aCb) {
    console.log(JSON.stringify(aParam));
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

    series.push(function (cb) {
        console.log('get packages');
        exports.modelPackage.getAll({}, function (err, packageList) {
            if (packageList) {
                packageList.forEach(function (p) {
                    packagesByName[p.name] = p;
                });
                console.log('packages count = ' + packageList.length);
            }
            cb();
        }, true);
    });

    series.push(function (cb) {
        console.log('get previous project item');
        exports.modelProject.getByProjectId(aParam.projectId, function (err, p) {
            project = p;
            console.log(p);
            cb();
        });
    });

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

    var newPackages = [];

    series.push(function (cb) {
        var newPackageNames = [];
        var packageNames = Object.keys(packagesByName);
        aParam.packageInfoList.forEach(function (info) {
            if (packageNames.indexOf(info.name) == -1 && newPackageNames.indexOf(info.name) == -1) {
                newPackages.push({
                    name: info.name,
                    type: info.type
                });
                newPackageNames.push(info.name);
            }
        });
        console.log('new packages to add: ' + newPackageNames.join(','));
        exports.Package.create(newPackages, function (err) {
            console.log(err);
            console.log('set packages');
            resp.packageNamesCreated = newPackageNames;

            exports.modelPackage.getAll({}, function (err, packageList) {
                if (packageList) {
                    console.log('update package list with count ' + packageList.length);
                    packageList.forEach(function (p) {
                        packagesByName[p.name] = p;
                    });
                }
                cb();
            }, true);
        });
    });

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
                aParam.packageInfoList.forEach(function (info) {
                    usagesToBeAdded.push({
                        projectId: project.id,
                        packageId: packagesByName[info.name].id
                    });
                    if (packageNames.indexOf(info.name) == -1) {
                        resp.packageNamesAdded.push(info.name);
                    }
                    requestedPackageNames.push(info.name);
                });

                project.packages.forEach(function (p) {
                    if (requestedPackageNames.indexOf(p.name) == -1) {
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
            console.log('update packages to project');
            console.log(JSON.stringify(packagesByName, null, 2));
            var usages = [];
            newPackages.forEach(function (info) {
                console.log(info.name);
                usages.push({
                    projectId: newProject.id,
                    packageId: packagesByName[info.name].id
                });
                resp.packageNamesAdded.push(info.name);
            });
            exports.PackageUsage.create(usages, function (err, usages) {
                console.log('Usages');
                console.log(usages);
                cb();
            });
        }
    });

    series.push(function (cb) {
        resp.ok = true;
        aCb(resp);
        cb();
    });

    async.series(series);
}
exports.SetProjectWithPackages = SetProjectWithPackages;
