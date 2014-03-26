/**
 * Created by sungwoo on 14. 3. 25.
 */
/// <reference path="../../typings/jugglingdb/jugglingdb.d.ts" />
/// <reference path="../../typings/async/async.d.ts" />

import jugglingdb = require('jugglingdb');
import async = require('async');

export var db = new jugglingdb.Schema('sqlite3', {
    database: 'ossdb.sqlite3',
    debug: true
});

export interface TOss {
    name: string;
    projectUrl: string;
    packages?: TPackage[];
}

export interface TLicense {
    name: string;
    type: string;
}

export interface TPackage {
    name: string;
}

export interface TProject {
    projectId: string;
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

Oss.hasMany(Package, {as: 'packages', foreignKey: 'ossId'});
//Oss.hasMany(Package);
License.hasMany(Package);
Project.hasMany(PackageUsage, {as: 'packages', foreignKey: 'projectId'});
Package.hasMany(PackageUsage, {as: 'projects', foreignKey: 'packageId'});
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
        projectId: 'hms1000sph2'
    }, {
        projectId: 'hdr1000s'
    }];

    var series = [];
    var newOss;
    var newLicense;
    var newPackage;
    var newProject;
    series.push((cb) => {
        db.automigrate(cb);
    });
    series.push((cb) => {
        Oss.create(fit_Oss, (err, model) => {
            newOss = model;
            cb();
        });
    });
    series.push((cb) => {
        License.create(fit_license, (err, model) => {
            newLicense = model;
            cb();
        });
    });
    series.push((cb) => {
        Package.create(fit_package, (err, model) => {
            newPackage = model;
            cb();
        });
    });
    series.push((cb) => {
        Project.create(fit_project, (err, model) => {
            newProject = model;
            cb();
        });
    });
//    series.push((cb) => {
//        // newOss.packages.build(newPackage).save(cb); <= this will remove name of newPackage
//        newPackage.updateAttribute('ossId', newOss.id, cb);
//    });
//    series.push((cb) => {
//        newPackage.updateAttribute('licenseId', newLicense.id, cb);
//    });
//    series.push((cb) => {
//        var newUsage = PackageUsage.create({});
//        newUsage.updateAttribute('projectId', newProject.id, () => {
//            newUsage.updateAttribute('packageId', newPackage.id, () => {
//                newUsage.save(cb);
//            });
//        });
//    });
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
