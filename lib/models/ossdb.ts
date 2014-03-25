/**
 * Created by sungwoo on 14. 3. 25.
 */
/// <reference path="../../typings/jugglingdb/jugglingdb.d.ts" />

import jugglingdb = require('jugglingdb');

export var db = new jugglingdb.Schema('sqlite3', {
    database: 'ossdb.sqlite3'
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

export var Oss: jugglingdb.Model<TOss> = db.define<TOss>('Oss', {
    name: {type: String, index: true},
    projectUrl: String
});

export var License: jugglingdb.Model<TLicense> = db.define<TLicense>('License', {
    name: String,
    type: String
});

export var Package: jugglingdb.Model<TPackage> = db.define<TPackage>('Package', {
    name: String
});

export var Project: jugglingdb.Model<TProject> = db.define<TProject>('Project', {
    projectId: String
});

db.autoupdate();

Oss.hasMany(Package);
License.hasMany(Package);
Package.hasMany(Project);
Project.hasMany(Package);
