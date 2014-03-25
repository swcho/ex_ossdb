/**
 * Created by sungwoo on 14. 3. 25.
 */

/// <reference path="../../../typings/node/node.d.ts" />
/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/async/async.d.ts" />
/// <reference path="../../../typings/should/should.d.ts" />
/// <reference path="../../../typings/supertest/supertest.d.ts" />

import async = require('async');
import request = require('supertest');
var should = require('should');

import ossdb = require('../../../lib/models/ossdb');

describe('ossdb functions', function() {

    beforeEach((done) => {

        var series = [];
        var newOss;
        var newLicense;
        var newPackage;
        var newProject;
        series.push((cb) => {
            ossdb.db.automigrate(cb);
        });
        series.push((cb) => {
            ossdb.Oss.create({
                name: "Open SSL",
                projectUrl: ''
            }, (err, model) => {
                model.save((err, model) => {
                    newOss = model;
                    console.log(newOss);
                    cb();
                });
            });
        });
        series.push((cb) => {
            ossdb.License.create({
                name: 'GPL 3.0',
                type: 'P'
            }, (err, model) => {
                newLicense = model;
                model.save(cb);
            });
        });
        series.push((cb) => {
            ossdb.Package.create({
                name: 'libopenssl.1.0.so'
            }, (err, model) => {
                model.save((err, model) => {
                    newPackage = model;
                    console.log(newPackage);
                    cb();
                });
            });
        });
        series.push((cb) => {
            ossdb.Project.create({
                projectId: 'hms1000sph2'
            }, (err, model) => {
                newProject = model;
                model.save(cb);
            });
        });
        series.push((cb) => {
            // newOss.packages.build(newPackage).save(cb); <= this will remove name of newPackage
            newPackage.updateAttribute('ossId', newOss.id, cb);
        });
        series.push((cb) => {
            newPackage.updateAttribute('licenseId', newLicense.id, cb);
        });
        series.push((cb) => {
            var newUsage = ossdb.PackageUsage.create({});
            newUsage.updateAttribute('projectId', newProject.id, () => {
                newUsage.updateAttribute('packageId', newPackage.id, () => {
                    newUsage.save(cb);
                });
            });
        });
        series.push((cb) => {
            console.log('prepare done');
            done();
        });
        async.series(series);
    });

    it('Oss should have OpenSSL', (done) => {
        ossdb.Oss.count((err, count) => {
            (<any>count).should.be.exactly(1);
            done();
        });
    });

    it('Oss should have one package', (done) => {
        ossdb.Oss.all((err, model) => {
            var oss = model[0];
            console.log(oss);
            oss.packages((err, packages) => {
                console.log(packages);
                done();
            });
        });
    });

    it('Project has one package', (done) => {
        ossdb.Project.all((err, model) => {
            var project = model[0];
            project.packages((err, packages) => {
                console.log(packages);
                done();
            });
        });
    })
});
