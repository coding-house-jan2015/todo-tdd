/* jshint expr:true */

'use strict';

var expect = require('chai').expect;
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var beforeEach = lab.beforeEach;
var server = require('../../server/index');
var cp = require('child_process');
var dbname = process.env.MONGO_URL.split('/')[3];

describe('users', function() {
  beforeEach(function(done) {
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [dbname], {cwd:__dirname + '/../scripts'}, function(){
      done();
    });
  });

  describe('get /register', function() {
    it('should display the registration page', function(done) {
      var options = {method:'get', url:'/register'};
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.payload).to.include('Register');
        done();
      });
    });
  });

  describe('get /login', function() {
    it('should display the login page', function(done) {
      var options = {method:'get', url:'/login'};
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.payload).to.include('Login');
        done();
      });
    });
  });

  describe('post /users', function() {
    it('should create a new user', function(done) {
      var options = {
        method:'post',
        url:'/users',
        payload:{
          email:'jil@aol.com',
          password:'123'
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(302);
        expect(response.headers.location).to.equal('/login');
        done();
      });
    });

    it('should NOT create a new user - duplicate email', function(done) {
      var options = {
        method:'post',
        url:'/users',
        payload:{
          email:'bob@aol.com',
          password:'123'
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(302);
        expect(response.headers.location).to.equal('/register');
        done();
      });
    });

    it('should NOT create a new user - empty email', function(done) {
      var options = {
        method:'post',
        url:'/users',
        payload:{
          email:'',
          password:'123'
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    it('should NOT create a new user - empty password', function(done) {
      var options = {
        method:'post',
        url:'/users',
        payload:{
          email:'sam@aol.com',
          password:''
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });
  });

  describe('post /users/authenticate', function() {
    it('should authenticate a user', function(done) {
      var options = {
        method:'post',
        url:'/users/authenticate',
        payload:{
          email:'bob@aol.com',
          password:'123'
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(302);
        expect(response.headers.location).to.equal('/');
        expect(response.headers['set-cookie']).to.be.instanceof(Array);
        done();
      });
    });

    it('should NOT authenticate a user - bad email or password', function(done) {
      var options = {
        method:'post',
        url:'/users/authenticate',
        payload:{
          email:'wrong@aol.com',
          password:'wrong'
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(302);
        expect(response.headers.location).to.equal('/login');
        done();
      });
    });
  });

});
