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

    var fit;
    before((done) => {
        fit = ossdb.set_fixture(done);
    });

//    it('Oss should have OpenSSL', (done) => {
//        ossdb.Oss.count((err, count) => {
//            (<any>count).should.be.exactly(fit.oss.length);
//            done();
//        });
//    });

//    it('Oss should have one package', (done) => {
//        ossdb.Oss.all((err, model) => {
//            var oss = model[0];
//            console.log(oss);
//            oss.packages((err, packages) => {
//                console.log(packages);
//                done();
//            });
//        });
//    });
//
//    it('Project has one package', (done) => {
//        ossdb.Project.all((err, model) => {
//            var project = model[0];
//            project.packages((err, packages) => {
//                console.log(packages);
//                done();
//            });
//        });
//    });
//
//    it('get_package', (done) => {
//        ossdb.get_package_by_id(1, (package) => {
//            console.log(package);
//            done();
//        });
//    });

    it('set project package', (done) => {
        ossdb.SetProjectWithPackages({
            projectId: 'project_new',
            packageNames: [
                'libcrypt-0.9.32.so',
                'libgcc_s.so.1',
                'libpthread-0.9.32.so',
                'libsqlite3.so.0.8.6',
                'libopenssl.1.0.2.so'
            ]
        }, (resp) => {
            console.log(resp);
            (<any>resp.ok).should.be.exactly(true);
            (<any>resp.projectAdded).should.be.exactly(true);
            (<any>resp.projectUpdated).should.be.exactly(false);
            should(resp.packageNamesCreated).be.eql([
                'libcrypt-0.9.32.so',
                'libgcc_s.so.1',
                'libpthread-0.9.32.so',
                'libsqlite3.so.0.8.6'
                //'libopenssl.1.0.2.so'
            ]);
            should(resp.packageNamesAdded).be.eql([
                'libcrypt-0.9.32.so',
                'libgcc_s.so.1',
                'libpthread-0.9.32.so',
                'libsqlite3.so.0.8.6',
                'libopenssl.1.0.2.so'
            ]);
            (<any>resp.packageNamesRemoved.length).should.be.exactly(0);
            done();
        });
    });

    it('set project package', (done) => {
        ossdb.SetProjectWithPackages({
            projectId: 'project_new',
            packageNames: [
                'libcrypt-0.9.32.so',
                'libgcc_s.so.1',
                'libpthread-0.9.32.so',
                //'libsqlite3.so.0.8.6', // removed
                'libopenssl.1.0.2.so',
                'libuClibc-0.9.32.so' // added
            ]
        }, (resp) => {
            console.log(resp);
            done();
        });
    });
});
