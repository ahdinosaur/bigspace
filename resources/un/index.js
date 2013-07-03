var resource = require('resource'),
    http = resource.use('http'),
    view = resource.use('view'),
    forms = resource.use('forms'),
    logger = resource.logger,
    un = resource.define('un');

un.schema.description = 'un makes resource easy';


//
// TODO: move this out of here to resource.toJSON
//
  function _resources () {
    var arr = [];
    Object.keys(resource.resources).forEach(function(r){
      arr.push(r);
    });
    return arr;
  }
  function _methods (resource) {
    var arr = [];
    Object.keys(resource.methods).forEach(function(m){
      arr.push(m);
    });
    return arr;
  }

un.dependencies = {
  express: '*'
};

un.license = "MIT";
exports.un = un;
