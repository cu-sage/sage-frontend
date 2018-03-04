var userModel = require('../models/userModel');
var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('./config');
var bcrypt = require('bcryptjs');

var createToken = function(user) {
    var payload = {
        exp: moment().add(14, 'days').unix(),
        iat: moment().unix(),
        sub: user._id
    };

    return jwt.encode(payload, config.tokenSecret);
};

// var isAuthenticated = function(req, res, next) {
//     if (!(req.headers && req.headers.authorization)) {
//         return res.status(400).send({message: 'No Token.'});
//     }
//
//     var header = req.headers.authorization.split(' ');
//     var token = header[1];
//     var payload = jwt.decode(token, config.tokenSecret);
//     var now = moment().unix();
//
//     if (now > payload.exp) {
//         return res.status(401).send({message: 'Token has expired.'});
//     }
//
//     userModel.findById(payload.sub, function(err, user) {
//         if (!user) {
//             return res.status(400).send({message: 'User does not exist.'});
//         }
//
//         req.user = user;
//         next();
//     });
// };

var getUser = function(req, callback) {
    if (!(req.headers && req.headers.authorization)) {
        callback({'_id': -1});
        return;
    }

    var header = req.headers.authorization.split(' ');
    var token = header[1];
    var payload = jwt.decode(token, config.tokenSecret);
    var userId = payload.sub;

    userModel.findById(userId, function(err, user) {
        if (err) {
            // console.log(err);
            callback(err);
            return;
        }
        // console.log('user: ' + user);
        callback(user);
    });
};

var reg = function(email, password, fullname, role, callback) {
    userModel.findOne({email: email}, function(err, existingUser) {
        if (existingUser) {
            callback(
                {status: 409, message: {email: 'Email is already taken.'}});
            return;
        }

        var user = new userModel({
            email: email,
            password: password,
            fullname: fullname,
            role: role
        });

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                user.password = hash;

                user.save(function() {
                    var token = createToken(user);
                    callback({status: 200, token: token});
                });
            });
        });
    });
};

var login = function(email, password, callback) {
    userModel.findOne({email: email}, '+password', function(err, user) {
        if (!user) {
            callback(
                {status: 401, message: {email: 'This user does not exist.'}});
            return;
        }

        bcrypt.compare(password, user.password, function(err, res) {
            if (err) {
                console.log(err);
                callback({status: 500, message: {email: 'An unknown error occurred.'}});
            }
            if (res) {
                user = user.toObject();
                delete user.password;

                var token = createToken(user);
                callback({status: 200, token: token, user: user});
            } else {
                callback({
                    status: 401,
                    message: {password: 'The password is not correct.'}
                });
            }
        });

        // bcrypt.compare(password, user.password, function(err, isMatch) {
        //     if (!isMatch) {
        //         callback({
        //             status: 401,
        //             message: {password: 'The password is not correct.'}
        //         });
        //         return;
        //     }

        //     user = user.toObject();
        //     delete user.password;

        //     var token = createToken(user);
        //     callback({status: 200, token: token, user: user});
        // });
    });
};

module.exports = {
    // isAuthenticated: isAuthenticated,
    getUser: getUser,
    reg: reg,
    login: login
};
