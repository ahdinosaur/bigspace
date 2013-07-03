var resource = require('resource'),
    async = require('async');
require('js-object-clone');

module['exports'] = function (options, callback) {

  options = options || {};
  var $ = this.$,
    self = this,
    r = resource.resources[options.resource],
    rMethod = r.methods[options.method];

  var domWithLayout = function(error) {
    options.err = error;
    self.layout({
      layout: self.parent.parent.layout,
      layoutOptions: options,
      selector: "#forms-main",
      html: $.html()
    }, callback);
  };

  // legend should show method description or method name
  $('legend').html(rMethod.schema.description || options.method || '');

  // submit button should show method name
  $('input[type="submit"]').attr('value', options.method);

  // if the action is to post, submit the form
  if (options.action === 'post') {
    var cb = function (err, result) {

      // if there are errors, remove results and display errors on the forms
      if (err) {
        $('.results').remove();
        return showForm(options.data, err);
      }

      $('form').remove();
      $('.result').html(JSON.stringify(result, true, 2));
      // if we were given a redirect, use it
      if (options.redirect) {
        // fill the redirect template
        var redirect = require('mustache').to_html(options.redirect, options.data);
        options.response.redirect(redirect);
      }
      return domWithLayout();
    };
    // submit the data
    return resource.invoke(rMethod, options.data, cb);

  // otherwise if the action is not post,
  } else {
    // show the form
    $('.results').remove();
    showForm(options.data);
  }

  function showForm (data, error) {
    data = data || {};
    var errors = (error) ? error.errors : {};
    if(typeof rMethod.schema.properties !== 'undefined') {
      var props = rMethod.schema.properties || {};

      // if this rMethod has an argument of "options",
      // use it as properties
      if (rMethod.schema.properties.options &&
        typeof rMethod.schema.properties.options.properties !== 'undefined') {
        props = rMethod.schema.properties.options.properties;
      }

      // clone props so we don't modify schema directly
      props = Object.clone(props);

      // remove callback from properties
      if (props.callback) {
        delete props.callback;
      }

      //
      // for each property key (in series),
      // append the property control to the dom
      //
      async.eachSeries(Object.keys(props),
        function(property, callback) {

          // make a shallow clone of this property as the control
          var control = {};
          for(var p in props[property]) {
            control[p] = props[property][p];
          }

          // label the control
          control.name = property;

          // if we have errors, add them to the control
          for(var e in errors) {
            if (errors[e].property === control.name) {
              control.error = errors[e];
            }
          }

          // if the data we were given has this property, add it to control.
          if(typeof data[property] !== 'undefined') {
            control.value = data[property];
          }
          // else, use control's default (if it has one) or the empty string
          else {
            control.value = control.default || '';
          }

          // add the control to options
          options.control = control;

          // call inputs presenter, which will handle delegation appropriately
          self.parent.inputs.index.present(options, function(err, result){
            if (err) { return callback(err); }
            $('.inputs').append(result);
            return callback(null);
          });
        },


        function(err) {
          if (err) { return domWithLayout(err); }
          // return the dom
          return domWithLayout(error);
        });

    // no properties remain, return the rendered form
    } else {
      return domWithLayout(error);
    }
  }

};
