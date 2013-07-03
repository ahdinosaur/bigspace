var resource = require('resource'),
    http = resource.use('http'),
    view = resource.use('view'),
    forms = resource.define('forms');

forms.schema.description = "for generating HTML forms";

function start(options, callback) {

  var express = require('express'),
      app = express();

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

  http.app.before('router').use(app).as('forms');
}
forms.method('start', start, {
  description: "starts forms",
  properties: {
    options: {
      type: 'object'
    },
    callback: {
      type: 'function'
    }
  }
});

forms.method("method", method, {
  "description": "generates a generic view based on a resource method schema",
  "properties": {
    "options": {
      "properties": {
        "resource": {
          "type": "string",
          "required": true
        },
        "method": {
          "type": "string",
          "required": true
        },
        "data": {
          "type": "object",
          "required": false
        }
      },
      "callback": {
        "type": "function"
      }
    }
  }
});

function method (options, callback) {
  if (options.data) {
    options.data = coerceTypes(resource[options.resource].schema, options.data);
  }
  view.create({ path: __dirname + '/view', input: "html"}, function (err, _view) {
    var form = _view.form[options.method] || _view.form['method'];
    form.present(options, callback);
  });
}

// incoming data from an interface such as HTTP form submits come in as strings,
// so we use the resource schema to coerce string values into the proper JavaScript types
function coerceTypes (schema, data) {
  if (typeof data === 'object' && Object.keys(data).length === 0) {
    return data;
  }
  Object.keys(schema.properties).forEach(function (prop, i) {
    var item = schema.properties[prop];
    switch(item['type']) {
      case 'boolean':
        // Remark: the non-existence of a boolean property indicates a false value
        if (typeof data[prop] === 'undefined') {
          data[prop] = false;
        } else {
          if(data[prop] !== 'false') {
            data[prop] = true;
          }
        }
        break;
      case 'array':
        // TODO: refactor required for different array types
        data[prop] = (data[prop] || '').replace(', ', '').split(',');
        break;
      case 'number':
        var numbery = parseFloat(data[prop], 10);
        if (numbery.toString() !== 'NaN') {
          data[prop] = numbery;
        }
        break;
    }
  });
  return data;
}

forms.dependencies = {
  'async': '*',
  'html-lang': '*',
  'mustache': '*',
  'js-object-clone': '*',
  'express': '*'
};

exports.forms = forms;