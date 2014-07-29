var jugglingdb = require('jugglingdb');
var crypto = require('crypto');

var db = jugglingdb['db'];
var authTypes = ['github', 'twitter', 'facebook', 'google'];

exports.User = db.define('User', {
    name: String,
    email: String,
    role: {
        type: String,
        default: 'user'
    },
    hashedPassword: String,
    provider: String,
    salt: String
});

Object.defineProperty(exports.User, 'password', {
    get: function () {
        return this._password;
    },
    set: function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    }
});

Object.defineProperty(exports.User, 'userInfo', {
    get: function () {
        return {
            'name': this.name,
            'role': this.role,
            'provider': this.provider
        };
    }
});

Object.defineProperty(exports.User, 'profile', {
    get: function () {
        return {
            'name': this.name,
            'role': this.role
        };
    }
});

exports.User.validatesUniquenessOf('email', { message: 'email is not unique' });

exports.User.validatesLengthOf('password', { min: 5, message: { min: 'Password is too short' } });

exports.User.prototype.authenticate = function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
};

exports.User.prototype.makeSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

exports.User.prototype.encryptPassword = function (password) {
    if (!password || !this.salt)
        return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
};
