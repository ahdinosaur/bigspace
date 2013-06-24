
module['exports'] = function (options, callback) {

  var resource = require('resource'),
      forms = resource.use('forms'),
      rName = options.resource || 'space',
      r = resource.use(rName),
      $ = this.$,
      _view = this;

  var action;
  if ((typeof r.view !== 'undefined') &&
    (typeof r.view[options.method] !== 'undefined') &&
    (typeof r.view[options.method].index !== 'undefined')) {
    action = function(options, callback) {
      options.layout = false;
      var viewObj = r.view[options.method].index;
      return viewObj.present.call(viewObj, options, callback);
    };
  } else {
    action = forms.generate;
  }
  action(options, function(err, str) {
    if (err) { throw err; }
    // display errors on layout
    if (err) { $('#error').append('<pre>' + err.stack + '</pre>'); }

    $('#main').html(str);
    return callback(null, $.html());
  });
};