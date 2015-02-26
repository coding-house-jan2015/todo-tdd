'use strict';

module.exports = function(query, name){
  var link = '/items?';

  if(query.filter){
    link += 'filter=' + query.filter + '&value=' + query.value;
  }

  if(query.sort !== name){
    link += '&sort=' + name;
  }else{
    link += '&sort=-' + name;
  }

  return link;
};
