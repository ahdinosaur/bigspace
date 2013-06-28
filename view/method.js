
module['exports'] = function (options, callback) {

  var resource = require('resource'),
      forms = resource.use('forms'),
      rName = options.resource || 'space',
      display = options.display || 'index',
      r = resource.use(rName),
      $ = this.$,
      _view = this;

  // TODO add methods to sidebar
  // r.methods

  // either delegate to resource view (if exists)
  // or default to using forms
  var delegate;
  // check if resource view exists
  if ((typeof r.view !== 'undefined') &&
    (typeof r.view[options.method] !== 'undefined') &&
    (typeof r.view[options.method][display] !== 'undefined')) {
    // TODO get rid of this hack because calling a view
    // directly shouldn't be a problem
    delegate = function(options, callback) {
      var viewObj = r.view[options.method][display];
      return viewObj.present.call(viewObj, options, callback);
    };
  } else {
    delegate = forms.method;
  }

  // now call the delegate we've decided on
  delegate(options, function(err, str) {

    // error handling
    if (err) {
      var message = '';

      // first accumulate the error messages
      if (err.errors) {
        err.errors.forEach(function(e){
          message += JSON.stringify(e);
        });
      } else {
        message += err.message;
      }

      // then display errors on layout
      $('#messageBar').append('<pre class="alert alert-error">' + err.stack + '</pre>');
    }

    // add result of action to layout
    $('.content').html(str);

    // return rendered result with layout
    return callback(null, $.html());
  });
};