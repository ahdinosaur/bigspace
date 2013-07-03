var resource = require('resource'),
    http = resource.use('http'),
    view = resource.use('view'),
    forms = resource.use('forms'),
    logger = resource.logger,
    un = resource.define('un');

un.schema.description = 'un makes resource easy';

function start(options, callback) {

  var express = require('express'),
      app = express();

  // change static middleware to be before router
  app.stack.forEach(function(ware) {
    if (ware.handle.label === 'static') {
      // remove existing static
      app.remove('static');
      // re-add before router
      app.before('router').use(ware.handle).as('static');
    }
  });

  var handle = function(options, next) {
    options = options || {};
    options.resource = options.resource || 'space';
    options.method = options.method || 'all';

    // if the resource is not in use
    if (!resource.resources[options.resource]) {
      // pass the request to the next in the middleware stack
      return next();
    }
    // if the resource is in use, call forms.method
    forms.method(options, function(err, str) {
      if (err) { throw err; }
      options.response.end(str);
    });
  };

  app.get('/', function (req, res, next) {

    handle({
      data: req.resource.params,
      request: req,
      response: res
    }, next);
  });

  app.get('/:resource', function (req, res, next) {

    handle({
      resource: req.param('resource'),
      data: req.resource.params,
      request: req,
      response: res
    }, next);
  });

  app.get('/:resource/:method', function (req, res, next) {

    handle({
      resource: req.param('resource'),
      method: req.param('method'),
      data: req.resource.params,
      id: req.resource.params.id,
      action: req.resource.params.__action || 'get',
      redirect: req.resource.params.__redirect,
      request: req,
      response: res
    }, next);
  });

  app.post('/:resource/:method', function (req, res, next) {

    handle({
      resource: req.param('resource'),
      method: req.param('method'),
      data: req.resource.params,
      id: req.resource.params.id,
      action: req.resource.params.__action || 'post',
      redirect: req.resource.params.__redirect,
      request: req,
      response: res
    }, next);
  });

  http.app.before('router').use(app).as('un');
}
un.method('start', start, {
  description: "starts un",
  properties: {
    options: {
      type: 'object',
      properties: {
        path: {
          type: 'string'
        }
      }
    },
    callback: {
      type: 'function'
    }
  }
});

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
