var resource = require('resource'),
    http = resource.use('http'),
    view = resource.use('view'),
    logger = resource.logger,
    un = resource.define('un');

un.schema.description = 'un makes big easy';

function start(options, callback) {

  // create view that should contain index, layout, and method
  view.create({ path: options.path }, function(err, _view) {
    if (err) { return callback(err); }

    // change static middleware to be before router
    http.app.stack.forEach(function(ware) {
      if (ware.handle.label === 'static') {
        // remove existing static
        http.app.remove('static');
        // re-add before router
        http.app.before('router').use(ware.handle);
      }
    });

    http.app.use(view.middle({ view: _view }));

    //
    // TODO: cleanup route handlers / make into common methods
    //

    http.app.get('/', function (req, res, next) {
      _view.index.present({
        request: req,
        response: res
      }, function(err, str){
        if (err) { throw err; }
        res.end(str);
      });
    });

    http.app.get('/:resource', function (req, res, next) {
      _view.index.present({
        resource: req.param('resource'),
        request: req,
        response: res
      }, function(err, str){
        if (err) { throw err; }
        res.end(str);
      });
    });

    http.app.get('/:resource/:method', function (req, res, next) {

      var data = req.query;

      _view.method.present({
        resource: req.param('resource'),
        method: req.param('method'),
        data: data,
        id: data.id,
        request: req,
        response: res
      }, function(err, str){
        if (err) { throw err; }
        res.end(str);
      });
    });

    http.app.post('/:resource/:method', function (req, res, next) {

      var data = req.body;

      _view.method.present({
        resource: req.param('resource'),
        method: req.param('method'),
        data: data,
        id: data.id,
        request: req,
        response: res,
        action: 'post'
      }, function(err, str){
        if (err) { throw err; }
        res.end(str);
      });

    });

    http.app.get('/:resource/:method/:id', function (req, res, next) {
      var data = req.query,
          _id = req.param('id');
      data.id = _id;

      _view.method.present({
        resource: req.param('resource'),
        method: req.param('method'),
        id: _id,
        data: data,
        request: req,
        response: res
      }, function(err, str){
        if (err) { throw err; }
        res.end(str);
      });
    });

    http.app.post('/:resource/:method/:id', function (req, res, next) {
      var data = req.body,
          _id = req.param('id');
      data.id = _id;

      _view.method.present({
        resource: req.param('resource'),
        method: req.param('method'),
        id: _id,
        data: data,
        request: req,
        response: res,
        action: 'post'
      }, function(err, str){
        res.end(str);
      });

    });

    return callback(null, http.server);
  });
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

un.dependencies = {};

un.license = "MIT";
exports.un = un;
