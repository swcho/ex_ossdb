var async = require('async');
var express = require('express');

var CModel = (function () {
    function CModel(aDb, aName, aSchema) {
        this._db = aDb;
        this._name = aName;
        this._schema = aSchema;
        this._model = aDb.define(aName, aSchema);
    }
    CModel.prototype.model = function () {
        return this._model;
    };
    CModel.prototype.setRoute = function (aApp) {
        var _this = this;
        var prefix = '/api/' + this._name.toLowerCase();
        aApp.get(prefix, function (req, res) {
            var page = parseInt(req.param('page'), 10) || 1;
            var limit = parseInt(req.param('limit'), 10) || 10;
            console.log('page ' + page);

            _this.count(function (err, count) {
                _this.getAll({
                    limit: limit,
                    offset: (page - 1) * limit
                }, function (err, itemList) {
                    res.json({
                        itemList: itemList,
                        page: page,
                        totalCount: count
                    });
                });
            });
        });
        aApp.post(prefix + '/new', function (req, res) {
            var item = req.body;
            _this.upsert(item, function (err, newItem) {
                res.json(newItem);
            });
        });
        aApp.get(prefix + '/:id', function (req, res) {
            var id = req.params['id'];
            _this.getById(id, function (err, item) {
                res.json(item);
            });
        });
        aApp.post(prefix + '/:id', function (req, res) {
            var id = req.params['id'];
            var item = req.body;
            item.id = id;
            _this.upsert(item, function (err, newItem) {
                res.json(newItem);
            });
        });
    };
    CModel.prototype.upsert = function (aItem, aCb) {
        this._model.upsert(aItem, function (err, oss) {
            aCb(err, oss);
        });
    };
    CModel.prototype.getById = function (aId, aCb) {
        var _this = this;
        this._model.find(aId, function (err, oss) {
            if (!err) {
                _this._populateItem(oss, aCb);
            }
        });
    };
    CModel.prototype.count = function (aCb) {
        this._model.count(aCb);
    };
    CModel.prototype.getAll = function (aParam, aCb, aDoNotPopulate) {
        if (typeof aDoNotPopulate === "undefined") { aDoNotPopulate = false; }
        var _this = this;
        this._model.all(aParam, function (err, itemList) {
            var series = [];
            if (!aDoNotPopulate) {
                itemList.forEach(function (item) {
                    series.push(function (cb) {
                        _this._populateItem(item, function (err, populatedItem) {
                            cb();
                        });
                    });
                });
            }

            series.push(function (cb) {
                aCb(err, itemList);
                cb();
            });
            async.series(series);
        });
    };
    CModel.prototype.getByUniqueId = function (aUniqueId, aCb) {
    };
    CModel.prototype.add = function (aItem, aCb) {
    };
    CModel.prototype._populateItem = function (aItem, aCb) {
    };
    return CModel;
})();
exports.CModel = CModel;
