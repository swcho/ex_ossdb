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

    var fit
    beforeEach((done) => {
        fit = ossdb.set_fixture(done);
    });

    it('Oss should have OpenSSL', (done) => {
        ossdb.Oss.count((err, count) => {
            (<any>count).should.be.exactly(fit.oss.length);
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
