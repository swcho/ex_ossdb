///<reference path='../node/node.d.ts' />

declare module 'jugglingdb' {
    export interface TCommonSchemaSettings {
        host?: string; // Database host
        port?: string; // Database port
        username?: string; // Username to connect to database
        password?: string; // Password to connect to database
        database: string; // Database name
        debug?: boolean; // Turn on verbose mode to debug db queries and lifecycle
    }

    // ref: http://jugglingdb.co/schema.3.html
    export class Schema {
        constructor(adapter, settings?: TCommonSchemaSettings);
        connected: boolean;
        disconnect();
        /*
         *
         * @param {String} modelName: String name in camel-case with first upper-case letter. This name will be used later to access model.
         */
        define<T>(modelName: string, properties: any, settings?: any): Model<T>;

        /*
         * To check if any db changes required use isActual method
         *
         * ex) schema.isActual(function(err, actual) {
         *       if (!actual) {
         *         schema.autoupdate();
         *       }
         *     })
         *
         */
        isActual(): boolean;

        /*
         * The automigrate method drop table (if exists) and create it again
         */
        automigrate(callback: Function);

        /*
         * autoupdate method generates ALTER TABLE query
         */
        autoupdate(callback?: Function);

        /*
         * Fired when db connection established. Params: none.
         */
        on(eventName: 'connected', cb: Function);

        /*
         * Fired when adapter logged line. Params: String message, Number duration
         */
        on(eventName: 'log', cb: (msg, duration) => void);

        on(eventName: string, cb: Function);
    }

    export interface TModelSaveOptions {
        validate: boolean;
        throws: boolean;
    }

    export interface TModelIterateOptions {
        batchSize: number; // batchSize which allows to specify size of batch loaded into memory from the database.
    }

    export interface TModelAllParams {
        where: { [key: string]: any; }; // Object { key: val, key2: {gt: 'val2'}}
        include?: any; // String, Object or Array. See AbstractClass.include documentation.
        order?: string;
        limit?: number;
        skip?: number;
    }

    export class Model<T> {
        /*
         * Create instance of Model with given data and save to database. Invoke callback when ready.
         * Callback accepts two arguments: error and model instance.
         *
         * When called with array of objects as first argument Model.create creates bunch of records.
         * Both err and model instance arguments passed to callback will be arrays then. When no errors happened err argument will be null.
         *
         * The value returned from Model.create depends on second argument too.
         * In case of Array it will return an array of instances, otherwise single instance.
         * But be away, this instance(s) aren't save to database yet and you have to wait until callback called to be able to do id-sensitive stuff.
         */
        create(data: T, callback?: (err, model: Model<T>) => void);
        create(array: T[], callback?: (err, model: Model<T>) => void);

        /*
         * Save instance to database, options is an object {validate: true, throws: false},
         * it allows to turn off validation (turned on by default) and throw error on validation error (doesn't throws by default).
         */
        save(options?: TModelSaveOptions, callback?: (err, model: Model<T>) => void);
        save(callback: (err, model: Model<T>) => void);

        /*
         * Save specified attributes database.
         * Invoke callback when ready.
         * Callback accepts two arguments: error and model instance.
         */
        updateAttributes(partialData: T, callback: (err, model: Model<T>) => void);

        /*
         * Shortcut for updateAttributes, but for one field, works in the save way as updateAttributes.
         */
        updateAttribute(key: string, value: any, callback: (err, model: Model<T>) => void);

        /*
         * Update when record with id=data.id found, insert otherwise. Be aware: no setters, validations or hooks applied when use upsert. This is seed-friendly method.
         */
        upsert(data: T, callback: (err, item: T) => void);

        /*
         * Delete database record. Invoke callback when ready. Callback accepts two arguments: error and model instance.
         */
        destroy(callback?: (err) => void);

        /*
         * Delete all Model instances from database. Be aware: destroyAll method doesn't perform destroy hooks.
         */
        destroyAll(callback: (err) => void);

        /*
         * Iterate through dataset and perform async method iterator.
         * This method designed to work with large datasets loading data by batches.
         * First argument (options) is optional and have same signature as for Model.all,
         * it has additional member batchSize which allows to specify size of batch loaded into memory from the database.
         *
         * Iterator argument is a function that accepts three arguments: item, callback and index in collection
         *
         * ex)
         * Model.iterate({batchSize: 100}, function(obj, next, i) {
         *     doSomethingAsync(obj, next);
         * }, function(err) {
         *     // all done
         * });
         *
         *
         */
        iterate(options: TModelIterateOptions, iterator: (obj: T, next, i: number) => void, callback: (err) => void);

        /*
         * Find instance by id. Invoke callback when ready. Callback accepts two arguments: error and model instance.
         */
        find(id, callback: (err, item: T) => void);

        findOne(params: TModelAllParams, callback: (err, item: T) => void);

        /*
         * Find all instances of Model, matched by query.
         * Fields used for filter and sort should be declared with {index: true} in model definition.
         */
        all(params: TModelAllParams, callback: (err, array: any[]) => void);
        all(callback: (err, array: any[]) => void);

        /*
         * Query count of instances stored in database.
         * Optional query param allows to count filtered set of records.
         * Callback called with error and count arguments.
         *
         * ex)
         * User.count({approved: true}, function(err, count) {
         *   console.log(count); // count of approved users stored in database
         * });
         *
         */
        count(query, callback: (err, count: number) => void);
        count(callback: (err, count: number) => void);

        // RELATIONS

        /*
         * Define all necessary stuff for "one to many" relation:
         * - foreign key in "many" model
         * - named scope in "one" model
         *
         * ex)
         * var Book = db.define('Book');
         * var Chapter = db.define('Chapters');
         *
         * // syntax 1 (old):
         * Book.hasMany(Chapter);
         * // syntax 2 (new):
         * Book.hasMany('chapters');
         *
         * Book.hasMany('chapters', {foreignKey: `chapter_id`});
         * Book.hasMany('stories', {model: Chapter});
         * Book.hasMany(Chapter, {as: 'stories'});
         *
         * Book.create(function(err, book) {
         *   // using 'chapters' scope for build:
         *   var c = book.chapters.build({name: 'Chapter 1'});
         *   // same as:
         *   c = new Chapter({name: 'Chapter 1', bookId: book.id});
         *   // using 'chapters' scope for create:
         *   book.chapters.create();
         *   // same as:
         *   Chapter.create({bookId: book.id});
         *
         *   // using scope for querying:
         *   book.chapters(function() {
         *     all chapters with bookId = book.id
         *   });
         *   book.chapters({where: {name: 'test'}, function(err, chapters) {
         *     // all chapters with bookId = book.id and name = 'test'
         *   });
         * });
         *
         *
         */
        hasMany(model: any, options?: any);
        hasMany(modelName: string, options?: any);

        /*
         *
         */
        belongsTo(model: any, options?: any);
        belongsTo(modelName: string, options?: any);

        /*
         *
         */
        hasAndBelongsToMany();

        /*
         * Validation
         */
        // User.validatesPresenceOf('name', 'email')
        validatesPresenceOf();
        // User.validatesLengthOf('password', {min: 5, message: {min: 'Password is too short'}});
        validatesLengthOf(name: string, param: any);
        // User.validatesInclusionOf('gender', {in: ['male', 'female']});
        validatesInclusionOf(name: string, param: any);
        // User.validatesExclusionOf('domain', {in: ['www', 'billing', 'admin']});
        validatesExclusionOf(name: string, param: any);
        // User.validatesNumericalityOf('age', {int: true});
        validatesNumericalityOf(name: string, param: any);
        // User.validatesUniquenessOf('email', {message: 'email is not unique'});
        validatesUniquenessOf(name: string, param: any);

        /*
         * prototype
         */
        prototype: any;
    }
}
