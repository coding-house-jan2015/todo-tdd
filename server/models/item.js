'use strict';

var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
    title: {type: String, required: true},
    due: {type: Date, required: true},
    createdAt: {type: Date, default: Date.now},
    isComplete: {type: Boolean, default: false},
    tags: [String],
    priority: {type: String, required: true},
    userId: {type: mongoose.Schema.ObjectId, ref: 'User', require: true}
});

itemSchema.pre('save', function(next){
  this.tags = this.tags[0].split(',').map(function(s){return s.trim().toLowerCase();});
  next();
});

module.exports = mongoose.model('Item', itemSchema);
