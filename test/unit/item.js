/* jshint expr:true */

'use strict';

var expect = require('chai').expect;
var User = require('../../server/models/user');
var Item = require('../../server/models/item');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var beforeEach = lab.beforeEach;
require('../../server/index');

var bob;

describe('User', function() {
  beforeEach(function(done) {
    User.remove(function() {
      User.register({email:'bob@aol.com', password:'123'}, function(err, user){
        bob = user;
        done();
      });
    });
  });

  describe('constructor', function() {
    it('should create a new item', function(done) {
      var item = new Item({title:'a', due:'2009-08-27', tags:'BbB , cCc , ddD', priority:'e', userId:bob._id});
      item.save(function(){
        expect(item._id).to.be.ok;
        expect(item.title).to.equal('a');
        expect(item.due).to.be.instanceof(Date);
        expect(item.createdAt).to.be.instanceof(Date);
        expect(item.isComplete).to.be.false;
        expect(item.tags).to.have.length(3);
        expect(item.tags[1]).to.equal('ccc');
        expect(item.priority).to.equal('e');
        expect(item.userId).to.deep.equal(bob._id);
        done();
      });
    });
  });

});
