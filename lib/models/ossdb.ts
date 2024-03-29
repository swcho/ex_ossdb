/**
 * Created by sungwoo on 14. 3. 25.
 */
/// <reference path="../../typings/jugglingdb/jugglingdb.d.ts" />
/// <reference path="../../typings/async/async.d.ts" />

import jugglingdb = require('jugglingdb');
import async = require('async');
import model = require('./model');

var db: jugglingdb.Schema = jugglingdb['db'];
console.log(process.cwd());

export interface TOss {
    name: string;
    projectUrl: string;
    packages?: TPackage[];
    getPackages?: Function;
}

export interface TLicense {
    name: string;
    type: string;
    packages?: TPackage[];
    getPackages?: Function;
}

export interface TPackage {
    name: string;
    type: string;
    getUsages?: (cb: (err, usages: TPackageUsage[]) => void) => void;
    projects?: TProject[];
    licenseId?: string;
    ossId?: string;
    getLicense?: Function;
    license?: TLicense;
    getOss?: Function;
    oss?: TOss;
}

export interface TProject {
    projectId: string;
    getUsages?: Function;
    packages?: TPackage[];
}

export interface TPackageUsage {
    projectId: number;
    packageId: number;
    getPackage?: Function;
    package?: TPackage;
    getProject?: Function;
    project?: TProject;
}

export class CModelOss extends model.CModel<TOss> {
    constructor(aDb: jugglingdb.Schema) {
        super(aDb, 'Oss', {
            'name': {type: String, index: true},
            'projectUrl': String
        }, 'name');
    }
    _populateItem(aItem: TOss, aCb: model.FCbWithItem<TOss>) {
        aItem.getPackages((err, packages) => {
            aItem.packages = packages;
            aCb(err, aItem);
        });
    }
}

export class CModelLicense extends model.CModel<TLicense> {
    constructor(aDb: jugglingdb.Schema) {
        super(aDb, 'License', {
            name: {type: String, index: true},
            type: String
        }, 'name');
    }
    _populateItem(aItem: TLicense, aCb: model.FCbWithItem<TLicense>) {
        aItem.getPackages((err, packages) => {
            aItem.packages = packages;
            aCb(err, aItem);
        });
    }
}

export class CModelPackage extends model.CModel<TPackage> {
    constructor(aDb: jugglingdb.Schema) {
        super(aDb, 'Package', {
            name: {type: String, index: true},
            type: String
        }, 'name');
    }
    _populateItem(aItem: TPackage, aCb: model.FCbWithItem<TPackage>) {
        aItem.getOss((err, oss) => {
            aItem.oss = oss;
            aItem.getLicense((err, license) => {
                aItem.license = license;
                aItem.getUsages((err, usages) => {
                    var projects = [];
                    var series = [];
                    usages.forEach((usage) => {
                        series.push((cb) => {
                            usage.getProject((err, project) => {
                                projects.push(project);
                                cb();
                            });
                        });
                    });
                    series.push((cb) => {
                        aItem.projects = projects;
                        aCb(err, aItem);
                        cb();
                    });
                    async.series(series);
                });
            });
        });
    }
}

export class CModelProject extends model.CModel<TProject> {
    constructor(aDb: jugglingdb.Schema) {
        super(aDb, 'Project', {
            projectId: {type: String, index: true}
        }, 'projectId');
    }
    _populateItem(aItem: TProject, aCb: model.FCbWithItem<TProject>) {
        aItem.getUsages((err, usages) => {
            var packages = [];
            var series = [];
            usages.forEach((usage) => {
                series.push((cb) => {
                    usage.getPackage((err, package) => {
                        packages.push(package);
                        cb();
                    });
                });
            });
            series.push((cb) => {
                aItem.packages = packages;
                aCb(err, aItem);
                cb();
            });
            async.series(series);
        });
    }
    getByProjectId(aProjectId: string, aCb: model.FCbWithItem<TProject>) {
        this.model().findOne({
            where: {
                projectId: aProjectId
            }
        }, (err, project) => {
            if (project) {
                this._populateItem(project, (err) => {
                    aCb(err, project);
                });
            } else {
                aCb(err, null);
            }
        });
    }
}

export var modelOss = new CModelOss(db);
export var modelLicense = new CModelLicense(db);
export var modelPackage = new CModelPackage(db);
export var modelProject = new CModelProject(db);

export var Oss: jugglingdb.Model<TOss> = modelOss.model();
//export var Oss: jugglingdb.Model<TOss> = db.define<TOss>('Oss', {
//    name: {type: String, index: true},
//    projectUrl: String
//});

export var License: jugglingdb.Model<TLicense> = modelLicense.model();
//export var License: jugglingdb.Model<TLicense> = db.define<TLicense>('License', {
//    name: {type: String, index: true},
//    type: String
//});

export var Package: jugglingdb.Model<TPackage> = modelPackage.model();
//export var Package: jugglingdb.Model<TPackage> = db.define<TPackage>('Package', {
//    name: {type: String, index: true}
//});

export var Project: jugglingdb.Model<TProject> = modelProject.model();
//export var Project: jugglingdb.Model<TProject> = db.define<TProject>('Project', {
//    projectId: {type: String, index: true}
//});

export var PackageUsage: jugglingdb.Model<TPackageUsage> = db.define<TPackageUsage>('PackageUsage', {
    projectId: {type: String, index: true},
    packageId: {type: String, index: true}
});

//db.autoupdate();

Oss.hasMany(Package, {as: 'getPackages', foreignKey: 'ossId'});
Package.belongsTo(Oss, {as: 'getOss', foreignKey: 'ossId'});

License.hasMany(Package, {as: 'getPackages', foreignKey: 'licenseId'});
Package.belongsTo(License, {as: 'getLicense', foreignKey: 'licenseId'});

Project.hasMany(PackageUsage, {as: 'getUsages', foreignKey: 'projectId'});
PackageUsage.belongsTo(Project, {as: 'getProject', foreignKey: 'projectId'});

Package.hasMany(PackageUsage, {as: 'getUsages', foreignKey: 'packageId'});
PackageUsage.belongsTo(Package, {as: 'getPackage', foreignKey: 'packageId'});
//PackageUsage.belongsTo(Project);
//PackageUsage.belongsTo(Package);



export function set_fixture(done) {

    db.automigrate(done);
    return;

    var i, iLen, j, jLen;

    var fit_Oss: TOss[] = [];
    var fit_package: TPackage[] = [];
    var fit_relation_package = [];

    iLen=20;
    jLen=20;
    var oss_name;
    for (i=0; i<iLen; i++) {
        oss_name = 'Oss_' + i;
        fit_Oss.push({
            name: oss_name,
            projectUrl: 'http://www.oss.com/' + i
        });
        for (j=0; j<jLen; j++) {
            fit_package.push({
                name: oss_name + '.' + j + '.so',
                type: 'lib'
            });
            fit_relation_package.push({
                ossId: i + 1,
                licenseId: j +1
            });
        }
    }

    var fit_license: TLicense[] = [];
    iLen=20;
    for (i=0; i<iLen; i++) {
        fit_license.push({
            name: 'License ' + i,
            type: 'Type ' + i
        });
    }

    var fit_project: TProject[] = [];
    iLen=20;
    for (i=0; i<iLen; i++) {
        fit_project.push({
            projectId: 'Project ' + i
        });
    }

    var fit_relation_packageUsage = [{
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
    series.push((cb) => {
        console.log('1');
        db.automigrate(cb);
    });
    series.push((cb) => {
        console.log('2');
        Oss.create(fit_Oss, (err, model) => {
            console.log(err);
            console.log(model);
            newOss = model;
            cb();
        });
    });
    series.push((cb) => {
        console.log('3');
        License.create(fit_license, (err, model) => {
            newLicense = model;
            cb();
        });
    });
    series.push((cb) => {
        console.log('4');
        Package.create(fit_package, (err, model) => {
            newPackages = model;
            cb();
        });
    });
    series.push((cb) => {
        console.log('5');
        Project.create(fit_project, (err, model) => {
            newProject = model;
            cb();
        });
    });
    series.push((cb) => {
        console.log('6');
        var s = [];
        newPackages.forEach((p, i) => {
            s.push((cb) => {
                p.updateAttributes(fit_relation_package[i], cb);
            });
        });
        s.push(() => {
            cb();
        });
        async.series(s);
    });
    series.push((cb) => {
        console.log('7');
        var s = [];
        fit_relation_packageUsage.forEach((usage) => {
            var newUsage = PackageUsage.create({
                projectId: usage.projectId,
                packageId: usage.packageId
            }, cb);
//            newUsage.updateAttributes(, cb);
            //newUsage.save(cb);
        });
        s.push(() => {
            cb();
        });
        async.series(s);
    });
    series.push((cb) => {
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

export interface TPackageInfo {
    name: string;
    type: string;
}

export interface TSetProjectWithPackagesParam {
    projectId: string;
    packageInfoList: TPackageInfo[];
}

export interface TSetProjectWithPackagesResp {
    ok: boolean;
    projectAdded: boolean;
    projectUpdated: boolean;
    packageNamesCreated: string[];
    packageNamesAdded: string[];
    packageNamesRemoved: string[];
}

export function SetProjectWithPackages(aParam: TSetProjectWithPackagesParam, aCb: (aResp: TSetProjectWithPackagesResp) => void) {
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

    // get packages
    series.push((cb) => {
        console.log('get packages');
        modelPackage.getAll({}, (err, packageList) => {
            if (packageList) {
                packageList.forEach((p) => {
                    packagesByName[p.name] = p;
                });
                console.log('packages count = ' + packageList.length);
            }
            cb();
        }, true);
    });

    // get previous project item
    series.push((cb) => {
        console.log('get previous project item');
        modelProject.getByProjectId(aParam.projectId, (err, p) => {
            project = p;
            console.log(p);
            cb();
        });
    });

    // add new project if previous project item does not exist
    series.push((cb) => {
        if (!project) {
            console.log('set new project if previous project item does not exist');
            Project.create({
                projectId: aParam.projectId
            }, (err, p) => {
                newProject = p;
                console.log(p);
                resp.projectAdded = true;
                cb();
            });
        } else {
            cb();
        }
    });

    var newPackages: TPackageInfo[] = [];
    // set packages
    series.push((cb) => {
        var newPackageNames: string[] = [];
        var packageNames = Object.keys(packagesByName);
        aParam.packageInfoList.forEach((info) => {
            if (packageNames.indexOf(info.name) == -1 && newPackageNames.indexOf(info.name) == -1) {
                newPackages.push({
                    name: info.name,
                    type: info.type
                });
                newPackageNames.push(info.name);
            }
        });
        console.log('new packages to add: ' + newPackageNames.join(','));
        Package.create(newPackages, (err) => {
            console.log(err);
            console.log('set packages');
            resp.packageNamesCreated = newPackageNames;

            // update package list
            modelPackage.getAll({}, (err, packageList) => {
                if (packageList) {
                    console.log('update package list with count ' + packageList.length);
                    packageList.forEach((p) => {
                        packagesByName[p.name] = p;
                    });
                }
                cb();
            }, true);
        });
    });

    // add packages to project
    series.push((cb) => {
        if (project) {
            if (project.packages) {
                console.log('has packages');
                console.log(project.packages);

                var packageNames = [];
                project.packages.forEach((p) => {
                    packageNames.push(p.name);
                });

                var usagesToBeAdded = [];
                var requestedPackageNames = [];
                aParam.packageInfoList.forEach((info) => {
                    usagesToBeAdded.push({
                        projectId: project.id,
                        packageId: packagesByName[info.name].id
                    });
                    if (packageNames.indexOf(info.name) == -1) {
//                        usagesToBeAdded.push({
//                            projectId: newProject.id,
//                            packageId: packagesByName[name].id
//                        });
                        resp.packageNamesAdded.push(info.name);
                    }
                    requestedPackageNames.push(info.name);
                });

//                var usagesToBeRemoved = [];
                project.packages.forEach((p) => {
                    if (requestedPackageNames.indexOf(p.name) == -1) {
//                        usagesToBeRemoved.push(p.id);
                        resp.packageNamesRemoved.push(p.name);
                    }
                });

                PackageUsage.all({
                    where: {
                        projectId: project.id
                    }
                },(err, usages) => {
                    console.log(err);
                    console.log(usages);
                    console.log(typeof usages);

                    var series = [];
                    usages.forEach((u) => {
                        series.push((cb) => {
                            u.destroy(cb);
                        });
                    });
                    series.push((cb) => {
                        PackageUsage.create(usagesToBeAdded, (err, usages) => {
                            console.log('Usages');
                            console.log(usages);
                            cb();
                        });
                    });
                    series.push((cb2) => {
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
            newPackages.forEach((info) => {
                console.log(info.name);
                usages.push({
                    projectId: newProject.id,
                    packageId: packagesByName[info.name].id
                });
                resp.packageNamesAdded.push(info.name);
            });
            PackageUsage.create(usages, (err, usages) => {
                console.log('Usages');
                console.log(usages);
                cb();
            });
        }
    });

    // finalize
    series.push((cb) => {
        resp.ok = true;
        aCb(resp);
        cb();
    });

    async.series(series);
}