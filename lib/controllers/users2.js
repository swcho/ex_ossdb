var user2 = require('../models/user2');
var passport = require('passport');

function create(req, res, next) {
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

function me(req, res) {
    res.json(req.user || null);
}
exports.me = me;
;
