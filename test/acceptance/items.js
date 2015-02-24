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

describe('items', function() {
  beforeEach(function(done) {
    User.remove(function() {
      User.register({email:'bob@aol.com', password:'123'}, function(){
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

});
