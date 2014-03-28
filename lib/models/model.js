/**
* Created by sungwoo on 14. 3. 20.
*/
var CModel = (function () {
    function CModel(aDb, aName, aSchema) {
        this._db = aDb;
        this._schema = aSchema;
        this._model = aDb.define(aName, aSchema);
    }
    CModel.prototype.model = function () {
        return this._model;
    };
    CModel.prototype.add = function (aItem, aCb) {
    };
    CModel.prototype.getById = function (aId, aCb) {
    };
    CModel.prototype.getByUniqueId = function (aUniqueId, aCb) {
    };
    return CModel;
})();
exports.CModel = CModel;
//# sourceMappingURL=model.js.map
