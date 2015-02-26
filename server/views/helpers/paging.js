'use strict';

module.exports = function(type, count, page, query){
  var link = '/items?';
  var pages = Math.ceil(count / 5);

  delete query.page;
  link += Object.keys(query).map(function(k){return k + '=' + query[k];}).join('&');

  if(type === 'next' && page < pages){
    page++;
  } else if(type === 'prev' && page > 1){
    page--;
  }

  link += '&page=' + page;

  return link;
};
