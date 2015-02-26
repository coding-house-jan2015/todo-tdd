'use strict';

var Item = require('../../models/item');
var moment = require('moment');
var sortHelper = require('../../views/helpers/sort');
var pagingHelper = require('../../views/helpers/paging');

module.exports = {
  handler: function(request, reply) {
    var filter = {userId:request.auth.credentials._id};
    if(request.query.filter){
      filter[request.query.filter] = request.query.value;
    }

    var sort = request.query.sort || {};
    var page = request.query.page || 1;
    var skip = (page - 1) * 5;

    Item.find(filter).sort(sort).skip(skip).limit(5).exec(function(err, items){
        Item.find(filter).count().exec(function(err, count){
          reply.view('templates/items/index', {items:items, moment:moment, sort:sortHelper, paging:pagingHelper, query:request.query, page:page, count:count, search:request.url.search || ''});
        });
    });
  }
};
