'use strict';

var Item = require('../../models/item');

module.exports = {
  handler: function(request, reply) {
    var filter = {userId:request.auth.credentials._id};
    if(request.query.filter){
      filter[request.query.filter] = request.query.value;
    }

    var sort = request.query.sort || {};
    var skip = request.query.skip || 0;

    Item.find(filter).sort(sort).skip(skip).limit(5).exec(function(err, items){
      reply.view('templates/items/index', {items:items});
    });
  }
};
