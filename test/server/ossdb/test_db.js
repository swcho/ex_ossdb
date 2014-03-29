var async = require('async');
var request = require('supertest');
var should = require('should');

var ossdb = require('../../../lib/models/ossdb');

describe('ossdb functions', function () {
    var _this = this;
    var fit;
    before(function (done) {
        _this.timeout(6000);
        fit = ossdb.set_fixture(done);
    });

    it('------ set project package #1', function (done) {
        ossdb.SetProjectWithPackages({
            projectId: 'project_new',
            packageNames: [
                'libcrypt-0.9.32.so',
                'libgcc_s.so.1',
                'libpthread-0.9.32.so',
                'libsqlite3.so.0.8.6',
                'libopenssl.1.0.2.so'
            ]
        }, function (resp) {
            console.log(resp);
            should(resp.ok).be.exactly(true);
            should(resp.projectAdded).be.exactly(true);
            should(resp.projectUpdated).be.exactly(false);
            should(resp.packageNamesCreated).be.eql([
                'libcrypt-0.9.32.so',
                'libgcc_s.so.1',
                'libpthread-0.9.32.so',
                'libsqlite3.so.0.8.6'
            ]);
            should(resp.packageNamesAdded).be.eql([
                'libcrypt-0.9.32.so',
                'libgcc_s.so.1',
                'libpthread-0.9.32.so',
                'libsqlite3.so.0.8.6',
                'libopenssl.1.0.2.so'
            ]);
            should(resp.packageNamesRemoved.length).be.exactly(0);
            done();
        });
    });

    it('------ set project package #2', function (done) {
        ossdb.SetProjectWithPackages({
            projectId: 'project_new',
            packageNames: [
                'libcrypt-0.9.32.so',
                'libgcc_s.so.1',
                'libpthread-0.9.32.so',
                'libopenssl.1.0.2.so',
                'libuClibc-0.9.32.so'
            ]
        }, function (resp) {
            console.log(resp);
            should(resp.ok).be.exactly(true);
            should(resp.projectAdded).be.exactly(false);
            should(resp.projectUpdated).be.exactly(true);
            should(resp.packageNamesCreated).be.eql([
                'libuClibc-0.9.32.so'
            ]);
            should(resp.packageNamesAdded).be.eql([
                'libuClibc-0.9.32.so'
            ]);
            should(resp.packageNamesRemoved).be.eql([
                'libsqlite3.so.0.8.6'
            ]);
            done();
        });
    });
});
