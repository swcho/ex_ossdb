/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/mongoose/mongoose.d.ts" />
/// <reference path="../models/user" />
//import mongoose = require('mongoose');
var user2 = require('../models/user2');
var passport = require('passport');

/**
* Create user
*/
function create(req, res, next) {
    //    var newUser: user.TUser = <user.TUser>(new User(req.body));
    //    newUser.provider = 'local';
    //    newUser.save<user.TUser>(function(err) {
    //        if (err) return res.json(400, err);
    //
    //        req.logIn(newUser, function(err) {
    //            if (err) return next(err);
    //
    //            return res.json(req.user.userInfo);
    //        });
    //    });
    var user = req.body;
    console.log(user);
    user.provider = 'local';
    var newUser = user2.User.create(user, function (err, user) {
        if (err) {
            return next(err);
        }
        return res.json(req.user.userInfo);
    });
}
exports.create = create;
;

/**
*  Get profile of specified user
*/
function show(req, res, next) {
    var userId = req.params.id;

    user2.User.find(userId, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.send(404);
        }
        res.send({ profile: user.profile });
    });
}
exports.show = show;
;

/**
* Change password
*/
function changePassword(req, res, next) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    user2.User.find(userId, function (err, user) {
        if (user.authenticate(oldPass)) {
            user.password = newPass;
            user.save(function (err) {
                if (err)
                    return res.send(400);

                res.send(200);
            });
        } else {
            res.send(403);
        }
    });
}
exports.changePassword = changePassword;
;

/**
* Get current user
*/
function me(req, res) {
    res.json(req.user || null);
}
exports.me = me;
;
//# sourceMappingURL=users2.js.map
