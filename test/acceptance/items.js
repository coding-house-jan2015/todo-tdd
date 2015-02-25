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

var cookie;

describe('items', function() {
  beforeEach(function(done) {
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [dbname], {cwd:__dirname + '/../scripts'}, function(){
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

  describe('post /items/3', function() {
    it('should update an item', function(done) {
      var options = {
        method:'post',
        url:'/items/0000000000000000000000a1',
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

    it('should NOT update an item - failed joi validation', function(done) {
      var options = {
        method:'post',
        url:'/items/not-an-id',
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

  describe('get /items', function() {
    it('should show all items', function(done) {
      var options = {
        method:'get',
        url:'/items',
        headers: {
          cookie: cookie
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    it('should filter items - priority', function(done) {
      var options = {
        method:'get',
        url:'/items?filter=priority&value=high',
        headers: {
          cookie: cookie
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.payload).to.include('dough');
        expect(response.payload).to.not.include('apple');
        done();
      });
    });

    it('should filter items - tags', function(done) {
      var options = {
        method:'get',
        url:'/items?filter=tags&value=tag5',
        headers: {
          cookie: cookie
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.payload).to.include('july');
        expect(response.payload).to.not.include('apple');
        done();
      });
    });

    it('should filter items - isComplete', function(done) {
      var options = {
        method:'get',
        url:'/items?filter=isComplete&value=true',
        headers: {
          cookie: cookie
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.payload).to.include('bread');
        expect(response.payload).to.not.include('apple');
        done();
      });
    });

    it('should sort items - due', function(done) {
      var options = {
        method:'get',
        url:'/items?sort=due',
        headers: {
          cookie: cookie
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.payload).to.include('lima');
        expect(response.payload).to.not.include('apple');
        done();
      });
    });

    it('should page items - page 2', function(done) {
      var options = {
        method:'get',
        url:'/items?sort=due&skip=5',
        headers: {
          cookie: cookie
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.payload).to.include('golf');
        expect(response.payload).to.not.include('apple');
        done();
      });
    });
  });

});
