/**
 * Created by sungwoo on 14. 3. 25.
 */
/// <reference path="../../typings/jugglingdb/jugglingdb.d.ts" />

import jugglingdb = require('jugglingdb');

export var db = new jugglingdb.Schema('sqlite3', {
    database: 'ossdb.sqlite3',
    debug: true
});

export interface TOss {
    name: string;
    projectUrl: string;
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

//Oss.hasMany(Package, {as: 'packages', foreignKey: 'packageId'});
Oss.hasMany(Package);
License.hasMany(Package);
Project.hasMany(PackageUsage, {as: 'packages', foreignKey: 'projectId'});
Package.hasMany(PackageUsage, {as: 'projects', foreignKey: 'packageId'});
//PackageUsage.belongsTo(Project);
//PackageUsage.belongsTo(Package);
