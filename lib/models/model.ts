/**
 * Created by sungwoo on 14. 3. 20.
 */

/// <reference path="../../typings/jugglingdb/jugglingdb.d.ts" />

import jugglingdb = require('jugglingdb');

export interface TAttribute {
    uniqueId?: boolean;
}

export interface TSchema {
    [filedName: string]: any;
}

export interface FDefaultCb {
    (err: any): void;
}

export class CModel<T> {

    private _db: jugglingdb.Schema;
    private _schema: TSchema;
    private _model: jugglingdb.Model<T>;
    private _uniqueIdKey: string;

    constructor(aDb: jugglingdb.Schema, aName: string, aSchema: TSchema) {
        this._db = aDb;
        this._schema = aSchema;
        this._model = aDb.define<T>(aName, aSchema);
    }
    model(): jugglingdb.Model<T> {
        return this._model;
    }
    add(aItem: T, aCb: FDefaultCb) {

    }
    getById(aId: string, aCb: (err: any, result: T) => void) {

    }
    getByUniqueId(aUniqueId: string, aCb: (err: any, result: T) => void) {

    }

}