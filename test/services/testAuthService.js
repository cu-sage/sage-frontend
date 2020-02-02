'use strict'

var assert = require('assert'),
    userModel = require('../../models/userModel'),
    authService = require('../../services/authService'),
    jwt = require('jwt-simple'),
    config = require('../../services/config'),
    moment = require('moment'),
    mongoose = require('mongoose'),
    chai = require('chai'),
    sinon = require('sinon'),
    bcrypt = require('bcryptjs');

require('sinon-mongoose');

var assert = chai.assert;

const fakeUserId = '00000000000000000000000a';
const fakeUserEmail = 'fakeuser@fakeuser.com';
const fakeUserPassword = 'fakepassword';
const fakeUserFullname = 'fake user';
const fakeUserRole = 'fakerole';

var userMock = sinon.mock(userModel);
var fakeUser = new userModel({
    _id: mongoose.Types.ObjectId(fakeUserId),
    email: fakeUserEmail,
    fullname: fakeUserFullname,
    role: fakeUserRole
});

bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(fakeUserPassword, salt, function(err, hash) {
        fakeUser.password = hash;
    });
});

var saveStub = sinon.stub(userModel.prototype, 'save').callsArg(0);
userMock.expects('findById').withArgs(fakeUserId).yields(null, fakeUser);
userMock.expects('findOne').withArgs({ email: fakeUserEmail}).yields(null, null);
userMock.expects('findOne').withArgs({ email: fakeUserEmail}, '+password').yields(null, fakeUser);


describe('authService', function() {

    describe('#createToken()', function() {
        it('should return a valid token for a valid user', function() {

            var token = authService.createToken(fakeUser);
            var decoded = jwt.decode(token, config.tokenSecret);
            assert(moment(decoded.exp).isAfter(decoded.iat));
            assert(fakeUser._id.equals(mongoose.Types.ObjectId(decoded.sub)));
        });
    });

    describe('#getUser()', function() {
        it('should return a valid user for a valid auth header token', function(done) {
            var req = {
                headers: {
                    authorization: 'fake ' + authService.createToken(fakeUser)
                }
            };
            authService.getUser(req,function(user){
                assert.equal(fakeUser,user);
                done();
            });
        });
    });

    describe('#reg()', function() {
        this.timeout(15000);
        it('should save the user and execute callback with a valid token', function(done) {
            authService.reg(
                fakeUser.email,
                fakeUser.password,
                fakeUser.fullname,
                fakeUser.role,
                null,
                function(result){
                    //{status: 200, token: token}
                    //console.log(result);
                    var decoded = jwt.decode(result.token, config.tokenSecret);
                    assert.equal(result.status, 200);
                    // The ID that's generated is non-deterministic, so to keep things simple, we'll just check length.
                    // Alternatively, we could mock out the user object and set a static _id.
                    assert.equal(decoded.sub.length, 24);
                    done();
                });
        });
    });

    describe('#login()', function() {
        it('should return a a valid token, status, and user object for valid credentials', function(done) {
            authService.login(fakeUser.email, fakeUserPassword, function(result){
                //{status: 200, token: token, user: user}
                assert.equal(result.status, 200);
                assert.equal(result.token.length, 172);
                assert.equal(fakeUser.email, result.user.email);
                assert.equal(fakeUser.fullname, result.user.fullname);
                assert.equal(fakeUser.role, result.user.role);
                done();
            });
        });
    });

});
