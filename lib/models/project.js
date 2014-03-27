/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/mongoose/mongoose.d.ts" />
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

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
//# sourceMappingURL=project.js.map
