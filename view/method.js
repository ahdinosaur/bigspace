
module['exports'] = function (options, callback) {

  var resource = require('resource'),
      forms = resource.use('forms'),
      rName = options.resource || 'space',
      display = options.display || 'index',
      r = resource.use(rName),
      $ = this.$,
      _view = this;

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
    delegate = forms.generate;
  }

  // now call the delegate we've decided on
  delegate(options, function(err, str) {

    // display errors on layout
    if (err) { $('#error').append('<pre>' + err.stack + '</pre>'); }

    // add result of action to layout
    $('#main').html(str);

    // return rendered result with layout
    return callback(null, $.html());
  });
};