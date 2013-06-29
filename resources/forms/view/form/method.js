var resource = require('resource'),
    async = require('async');
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
      var props = method.schema.properties || {};

      // if this method has an argument of "options",
      // use it as properties
      if (method.schema.properties.options &&
        typeof method.schema.properties.options.properties !== 'undefined') {
        props = method.schema.properties.options.properties;
      }

      // clone props so we don't modify schema directly
      props = Object.clone(props);

      // remove callback from properties
      if (props.callback) {
        delete props.callback;
      }

      // submit button should show method name
      $('#submit').html(options.method);

      // for each property key (in series),
      async.eachSeries(Object.keys(props),
        // append the property input to the dom
        function(property, callback) {
          var input = {};
          for(var p in props[property]) {
            input[p] = props[property][p];
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
          self.parent.inputs.index.present(options, function(err, result){
            if (err) { return callback(err); }
            $('.inputs').append(result);
            callback(null);
          });
        },
        function(err) {
          if (err) { return callback(err); }
          // return the dom
          return callback(null, $.html());
        });

    // no properties remain, return the rendered form
    } else {
      callback(null, $.html());
    }
  }

};
