/**
 * Created by sungwoo on 14. 3. 20.
 */

/// <reference path="../../typings/jugglingdb/jugglingdb.d.ts" />
/// <reference path="../../typings/async/async.d.ts" />
/// <reference path="../../typings/express/express.d.ts" />

import jugglingdb = require('jugglingdb');
import async = require('async');
import express = require('express');

export interface TAttribute {
    uniqueId?: boolean;
}

export interface TSchema {
    [filedName: string]: any;
}

export interface FDefaultCb {
    (err: any): void;
}

export interface FCbWithItem<T> {
    (err: any, result: T): void;
}

export interface FCbWithItemList<T> {
    (err: any, result: T[]): void;
}

export class CModel<T> {

    private _db: jugglingdb.Schema;
    private _name: string;
    private _schema: TSchema;
    private _model: jugglingdb.Model<T>;
    private _uniqueIdKey: string;

    constructor(aDb: jugglingdb.Schema, aName: string, aSchema: TSchema) {
        this._db = aDb;
        this._name = aName;
        this._schema = aSchema;
        this._model = aDb.define<T>(aName, aSchema);
    }
    model(): jugglingdb.Model<T> {
        return this._model;
    }
    setRoute(aApp: express.Application) {
        var prefix = '/api/' + this._name.toLowerCase();
        aApp.get(prefix, (req: express.Request, res: express.Response) => {
            var page = parseInt(req.param('page'), 10) || 1;
            var limit = parseInt(req.param('limit'), 10) || 10;
            console.log('page ' + page);

            this.count((err, count) => {
                this.getAll({
                    limit: limit,
                    offset: (page - 1) * limit
                }, (err, itemList) => {
                    res.json({
                        itemList: itemList,
                        page: page,
                        totalCount: count
                    });
                });
            });
        });
        aApp.post(prefix + '/new', (req: express.Request, res: express.Response) => {
            var item = req.body;
            this.upsert(item, (err, newItem) => {
                res.json(newItem);
            });
        });
        aApp.get(prefix + '/:id', (req: express.Request, res: express.Response) => {
            var id = req.params['id'];
            this.getById(id, (err, item) => {
                res.json(item);
            });
        });
        aApp.post(prefix + '/:id', (req: express.Request, res: express.Response) => {
            var id = req.params['id'];
            var item = req.body;
            item.id = id;
            this.upsert(item, (err, newItem) => {
                res.json(newItem);
            });

        });
    }
    upsert(aItem: T, aCb: FCbWithItem<T>) {
        this._model.upsert(aItem, (err, oss) => {
            aCb(err, oss);
        });
    }
    getById(aId: string, aCb: FCbWithItem<T>) {
        this._model.find(aId, (err, oss) => {
            if (!err) {
                this._populateItem(oss, aCb);
            }
        });
    }
    count(aCb: (err, count) => void) {
        this._model.count(aCb);
    }
    getAll(aParam: any, aCb: FCbWithItemList<T>, aDoNotPopulate: boolean = false) {
        this._model.all(aParam, (err, itemList) => {
            var steps = [];
            if (!aDoNotPopulate) {
                itemList.forEach((item) => {
                    steps.push((cb) => {
                        this._populateItem(item, (err, populatedItem) => {
                            cb();
                        });
                    });
                });
            }

            steps.push((cb) => {
                cb();
            });
            async.series(steps, () => {
                aCb(err, itemList);
            });
        });
    }
    getByUniqueId(aUniqueId: string, aCb: FCbWithItem<T>) {

    }
    add(aItem: T, aCb: FDefaultCb) {

    }
    _populateItem(aItem: T, aCb: FCbWithItem<T>) {

    }

}