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
        series.push((cb) => {
            ossdb.db.automigrate(cb);
        });
        series.push((cb) => {
            ossdb.Oss.create({
                name: "Open SSL",
                projectUrl: ''
            }, (err, model) => {
                model.save(cb);
            });
        });
        series.push((cb) => {
            ossdb.License.create({
                name: 'GPL 3.0',
                type: 'P'
            }, (err, model) => {
                model.save(cb);
            });
        });
        series.push((cb) => {
            ossdb.Package.create({
                name: 'libopenssl.1.0.so'
            }, (err, model) => {
                model.save(cb);
            });
        });
        series.push((cb) => {
            ossdb.Project.create({
                projectId: 'hms1000sph2'
            }, (err, model) => {
                model.save(cb);
            });
        });
        series.push((cb) => {
            console.log('prepare done');
            done();
        });
        async.series(series);
    });

    it('Oss should have OpenSSL', function(done) {
        console.log('start');
        ossdb.Oss.count((err, count) => {
            console.log('counted');
            (<any>count).should.be.exactly(1);
            done();
        });
    });
});
