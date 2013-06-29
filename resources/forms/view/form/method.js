var resource = require('resource');
require('js-object-clone');

module['exports'] = function (options, callback) {

  options = options || {};
  var $ = this.$,
    self = this,
    output = '',
    method = resource[options.resource].methods[options.method],
    desc;

  desc = method.schema.description || '';

  if (desc.length === 0) {
    desc = options.method;
  }

  $('#submit').attr('value', options.method);
  $('legend').html(desc);

  // if the action is to post, submit the form
  if (options.action === 'post') {
    var cb = function (err, result) {
      if (err) { return callback(err); }
      $('form').remove();
      $('.result').html(JSON.stringify(result, true, 2));
      // if we were given a redirect, use it
      if (options.redirect) {
        // fill the redirect template
        var redirect = require('mustache').to_html(options.redirect, options.data);
        options.response.redirect(redirect);
      }
      return callback(null, $.html());
    };
    // submit the data
    return resource.invoke(method, options.data, cb);

  // otherwise if the action is not post,
  } else {
    // show the form
    $('.results').remove();
    showForm(options.data);
  }

  function showForm (data, errors) {
    data = data || {};
    if(typeof method.schema.properties !== 'undefined') {
      var _props = method.schema.properties || {};

      // if this method has an argument of "options",
      // use it as properties
      if (method.schema.properties.options &&
        typeof method.schema.properties.options.properties !== 'undefined') {
        _props = method.schema.properties.options.properties;
      }

      // clone props so we don't modify schema directly
      _props = Object.clone(_props);

      // remove callback from properties
      if (_props.callback) {
        delete _props.callback;
      }

      $('#submit').attr('value', options.method);

      var cont = function(err, result) {
        if (result) {
          output += result;
        }
        if(arr.length === 0) {
          $('.inputs').html(output);
          return callback(null, $.html());
        }
        var property = arr.pop();
        var input = {};
        for(var p in _props[property]) {
          input[p] = _props[property][p];
        }
        input.name = property;
        for(var e in errors) {
          if (errors[e].property === input.name) {
            input.error = errors[e];
          }
        }
        if(typeof data[input.name] !== 'undefined') {
          input.value = data[input.name];
        } else {
          input.value = input.default || '';
        }
        options.control = input;
        self.parent.inputs.index.present(options, function(err, str){
          cont(err, str);
        });
      };

      var arr = Object.keys(_props);
      arr.reverse();
      cont();

    // no properties remain, return the rendered form
    } else {
      callback(null, $.html());
    }
  }

}
