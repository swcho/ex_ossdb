/**
* Created by sungwoo on 14. 3. 25.
*/
var should = require('should');

var ossdb = require('../../../lib/models/ossdb');

describe('ossdb functions', function () {
    var _this = this;
    var fit;
    before(function (done) {
        _this.timeout(6000);
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
//# sourceMappingURL=test_db.js.map
