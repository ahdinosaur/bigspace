
module['exports'] = function (options, callback) {

  var resource = require('resource'),
      html = require('html-lang'),
      forms = resource.use('forms'),
      rName = options.resource || 'space',
      method = options.method || 'all',
      display = options.display || 'index',
      r = resource.use(rName),
      $ = this.$,
      _view = this;

  // add methods to sidebar
  var tmpl = '<li class="sideTab"><a class="sideLink" href=""></a></li>';
  Object.keys(r.methods).sort().forEach(function(methodName) {
    $('#sideNav').append(html.render({
      'sideTab.class': (methodName === method) ? 'active' : undefined,
      'sideLink': methodName,
       // TODO append id (if any) to href
      'sideLink.href': "/" + rName + "/" + methodName
    }, tmpl));
  });

  // either delegate to resource view (if exists)
  // or default to using forms
  var delegate;
  // check if resource view exists
  if ((typeof r.view !== 'undefined') &&
    (typeof r.view[method] !== 'undefined') &&
    (typeof r.view[method][display] !== 'undefined')) {
    // TODO get rid of this hack because calling a view
    // directly shouldn't be a problem
    delegate = function(options, callback) {
      var viewObj = r.view[method][display];
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