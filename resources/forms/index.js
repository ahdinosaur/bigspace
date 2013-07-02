var resource = require('resource'),
    forms = resource.define('forms');

resource.use('view');
resource.use('html');

forms.schema.description = "for generating HTML forms";

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
  resource.view.create({ path: __dirname + '/view', input: "html"}, function (err, view) {
    var str = '', form;
    form = view.form[options.method] || view.form['method'];
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
  'js-object-clone': '*'
};

exports.forms = forms;