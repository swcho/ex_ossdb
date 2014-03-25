/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/mongoose/mongoose.d.ts" />

import mongoose = require('mongoose');

var Schema = mongoose.Schema;

export interface TOss extends mongoose.Document {
    name: string;
    projectUrl: string;
    packages: TPackage[];
}

export interface TLicense extends mongoose.Document {
    name: string;
    type: string;
    packages: TPackage[];
}

export interface TPackage extends mongoose.Document {
    name: string;
    oss: TOss;
    license: TLicense;
    projects: TProject;
}

export interface TProject extends mongoose.Document {
    projectId: string;
    packages: TPackage[];
}

var OssSchema = new Schema({
    name: String,
    projectUrl: String,
    packages: [{ type: Schema.Types.ObjectId, ref: 'Package' }]
});

var LicenseSchema = new Schema({
    name: String,
    type: String,
    packages: [{ type: Schema.Types.ObjectId, ref: 'Package' }]
});

var ProjectSchema = new Schema({
    projectId: String,
    packages: [{ type: Schema.Types.ObjectId, ref: 'Package' }]
});
