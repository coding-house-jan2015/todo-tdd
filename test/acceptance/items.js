/* jshint expr:true */

'use strict';

var expect = require('chai').expect;
var User = require('../../server/models/user');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var beforeEach = lab.beforeEach;
var server = require('../../server/index');

var cookie;
var bob;

describe('items', function() {
  beforeEach(function(done) {
    User.remove(function() {
      User.register({email:'bob@aol.com', password:'123'}, function(err, user){
        bob = user;
        var options = {
          method:'post',
          url:'/users/authenticate',
          payload:{
            email:'bob@aol.com',
            password:'123'
          }
        };
        server.inject(options, function(response){
          cookie = response.headers['set-cookie'][0].match(/hapi-cookie=[^;]+/)[0];
          done();
        });
      });
    });
  });

  describe('get /items/new', function() {
    it('should display the new item page', function(done) {
      var options = {
        method:'get',
        url:'/items/new',
        headers: {
          cookie: cookie
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.payload).to.include('New Item');
        done();
      });
    });
  });

  describe('post /items', function() {
    it('should create a new item', function(done) {
      var options = {
        method:'post',
        url:'/items',
        payload: {
          title: 'a',
          due: '2008-11-03',
          tags: 'b,c,d',
          priority: 'e'
        },
        headers: {
          cookie: cookie
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(302);
        expect(response.headers.location).to.include('/items');
        done();
      });
    });

    it('should NOT create a new item - failed joi validation', function(done) {
      var options = {
        method:'post',
        url:'/items',
        payload: {
          title: '',
          due: '',
          tags: '',
          priority: ''
        },
        headers: {
          cookie: cookie
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });
  });

});
