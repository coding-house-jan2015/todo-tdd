'use strict';

var Item = require('../../models/item');
var Joi = require('joi');

module.exports = {
  validate: {
    payload: {
      title: Joi.string().required(),
      due: Joi.date().required(),
      tags: Joi.string().required(),
      priority: Joi.string().required()
    }
  },
  handler: function(request, reply) {
    request.payload.userId = request.auth.credentials._id;
    var item = new Item(request.payload);
    item.save(function(){
      reply.redirect('/items');
    });
  }
};
