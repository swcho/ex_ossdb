/**
 * Created by sungwoo on 14. 3. 25.
 */
/// <reference path="../../typings/jugglingdb/jugglingdb.d.ts" />
/// <reference path="../../typings/async/async.d.ts" />

import jugglingdb = require('jugglingdb');
import async = require('async');

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
    getUsages?: Function;
    projects?: TProject[];
    licenseId?: string;
    ossId?: string;
    license?: TLicense;
    oss?: TOss;
}

export interface TProject {
    projectId: string;
    getUsages?: Function;
    packages?: TPackage[];
}

export interface TPackageUsage {

}

export var Oss: jugglingdb.Model<TOss> = db.define<TOss>('Oss', {
    name: {type: String, index: true},
    projectUrl: String
});

export var License: jugglingdb.Model<TLicense> = db.define<TLicense>('License', {
    name: {type: String, index: true},
    type: String
});

export var Package: jugglingdb.Model<TPackage> = db.define<TPackage>('Package', {
    name: {type: String, index: true}
});

export var Project: jugglingdb.Model<TProject> = db.define<TProject>('Project', {
    projectId: {type: String, index: true}
});

export var PackageUsage: jugglingdb.Model<TPackageUsage> = db.define<TPackageUsage>('PackageUsage', {
});

//db.autoupdate();

Oss.hasMany(Package, {as: 'getPackages', foreignKey: 'ossId'});
//Oss.hasMany(Package);
License.hasMany(Package, {as: 'getPackages', foreignKey: 'licenseId'});
Project.hasMany(PackageUsage, {as: 'getUsages', foreignKey: 'projectId'});
Package.hasMany(PackageUsage, {as: 'getUsages', foreignKey: 'packageId'});
//PackageUsage.belongsTo(Project);
//PackageUsage.belongsTo(Package);

export function set_fixture(done) {

    var fit_Oss: TOss[] = [{
        name: 'OpenSSL',
        projectUrl: "http://www.openssl.org/"
    }, {
        name: 'libpng',
        projectUrl: "http://www.libpng.org/pub/png/libpng.html"
    }, {
        name: 'libzip',
        projectUrl: "http://www.nih.at/libzip/"
    }];

    var fit_license: TLicense[] = [{
        name: 'GNU General Public License (GPLv2)',
        type: 'Reciprocal'
    }, {
        name: 'GNU Library or Lesser General Public License (LGPLv2)',
        type: 'Reciprocal'
    }];

    var fit_package: TPackage[] = [{
        name: 'libopenssl.1.0.0.so'
    }, {
        name: 'libopenssl.1.0.1.so'
    }, {
        name: 'libopenssl.1.0.2.so'
    }, {
        name: 'libpng.1.0.1.so'
    }];

    var fit_project: TProject[] = [{
        projectId: 'project_acme'
    }, {
        projectId: 'project_andromeda'
    }];

    var fit_relation_package = [{
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
                'projectId': usage.projectId,
                'packageId': usage.packageId
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

export function get_oss_by_id(aId, aCb: (oss: any) => void) {
    Oss.find(aId, (err, oss) => {
        oss.getPackages((err, packages) => {
            oss.packages = packages;
            aCb(oss);
        });
    });
}

export function get_oss_all(aCb: (ossList: any) => void) {
    Oss.all((err, ossList) => {
        var s = [];
        ossList.forEach((oss) => {
            s.push((cb) => {
                oss.getPackages((err, packages) => {
                    oss.packages = packages;
                    cb();
                });
            });
        });
        s.push((cb) => {
            aCb(ossList);
            cb();
        });
        async.series(s);
    });
}

export function set_oss(aOss: any, aCb: (oss: any) => void) {
    Oss.upsert(aOss, (err, oss) => {
        aCb(oss);
    });
}

export function get_license_by_id(aId, aCb: (license: any) => void) {
    License.find(aId, (err, license) => {
        license.getPackages((err, packages) => {
            license.packages = packages;
            aCb(license);
        });
    });
}

export function get_license_all(aCb: (licenseList: any) => void) {
    License.all((err, licenseList) => {
        var s = [];
        licenseList.forEach((license) => {
            s.push((cb) => {
                license.getPackages((err, packages) => {
                    license.packages = packages;
                    cb();
                });
            });
        });
        s.push((cb) => {
            aCb(licenseList);
            cb();
        });
        async.series(s);
    });
}

export function set_license(aLicense: any, aCb: (license: any) => void) {
    License.upsert(aLicense, (err, license) => {
        aCb(license);
    });
}

function populate_package(aPackage: TPackage, aCb) {
    Oss.find(aPackage.ossId, (err, oss) => {
        aPackage.oss = oss;
        License.find(aPackage.licenseId, (err, license) => {
            aPackage.license = license;
            aPackage.getUsages((err, usages) => {
                var projects = [];
                var series = [];
                usages.forEach((usage) => {
                    series.push((cb) => {
                        Project.find(usage.projectId, (err, project) => {
                            console.log(project);
                            projects.push(project);
                            cb();
                        });
                    })
                });
                series.push((cb) => {
                    aPackage.projects = projects;
                    aCb();
                    cb();
                });
                async.series(series);
            });
        })
    });
}

export function get_package_by_id(aId, aCb: (package: any) => void) {
    Package.find(aId, (err, package) => {
        populate_package(package, () => {
            aCb(package);
        });
    })
}

export function get_package_by_name(aName, aCb: (package: any) => void) {
    Package.findOne({
        where: {
            name: aName
        }
    }, (err, package) => {
        aCb(package);
    });
}

export function get_package_all(aCb: (package: any) => void, aDoNotPopulate?: boolean) {
    Package.all((err, packageList) => {
        if (aDoNotPopulate) {
            aCb(packageList);
        } else {
            var s = [];
            packageList.forEach((package) => {
                s.push((cb) => {
                    populate_package(package, cb);
                });
            });
            s.push((cb) => {
                console.log(packageList);
                aCb(packageList);
                cb();
            });
            async.series(s);
        }
    });
}

export function set_package(aPackage: any, aCb: (p: any) => void) {
    License.upsert(aPackage, (err, p) => {
        aCb(p);
    });
}

function populate_project(aProject: TProject, aCb) {
    aProject.getUsages((err, usages) => {
        var packages = [];
        var series = [];
        usages.forEach((usage) => {
            series.push((cb) => {
                Package.find(usage.packageId, (err, package) => {
                    packages.push(package);
                    cb();
                });
            });
        });
        series.push((cb2) => {
            aProject.packages = packages;
            aCb();
            cb2();
        });
        async.series(series);
    });
}

export function get_project_by_id(aId, aCb: (project: any) => void) {
    Project.find(aId, (err, project) => {
        populate_project(project, () => {
            aCb(project);
        });
    });
}

export function get_project_by_projectId(aProjectId, aCb: (project: any) => void) {
    Project.findOne({
        where: {
            projectId: aProjectId
        }
    }, (err, project) => {
        if (project) {
            populate_project(project, () => {
                aCb(project);
            });
        } else {
            aCb(null);
        }
    });
}

export function get_project_all(aCb: (projectList: any) => void) {
    Project.all((err, projectList) => {
        var s = [];
        projectList.forEach((project) => {
            s.push((cb) => {
                populate_project(project, cb);
            });
        });
        s.push((cb) => {
            aCb(projectList);
            cb();
        });
        async.series(s);
    });
}

export function set_project(aProject: any, aCb: (p: any) => void) {
    License.upsert(aProject, (err, p) => {
        aCb(p);
    });
}

export interface TSetProjectWithPackagesParam {
    projectId: string;
    packageNames: string[];
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
        get_package_all((packageList) => {
            packageList.forEach((p) => {
                packagesByName[p.name] = p;
            });
            cb();
        }, true);
    });

    // get previous project item
    series.push((cb) => {
        get_project_by_projectId(aParam.projectId, (p) => {
            project = p;
            console.log('get previous project item');
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

    // set packages
    series.push((cb) => {
        var newPackages: TPackage[] = [];
        var newPackageNames: string[] = [];
        var packageNames = Object.keys(packagesByName);
        aParam.packageNames.forEach((name) => {
            if (packageNames.indexOf(name) == -1) {
                newPackages.push({
                    name: name
                });
                newPackageNames.push(name);
            }
        });
        Package.create(newPackages, (err) => {
            console.log('set packages');
            resp.packageNamesCreated = newPackageNames;

            // update package list
            get_package_all((packageList) => {
                packageList.forEach((p) => {
                    packagesByName[p.name] = p;
                });
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
                aParam.packageNames.forEach((name) => {
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
            var usages = [];
            aParam.packageNames.forEach((name) => {
                usages.push({
                    projectId: newProject.id,
                    packageId: packagesByName[name].id
                });
                resp.packageNamesAdded.push(name);
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