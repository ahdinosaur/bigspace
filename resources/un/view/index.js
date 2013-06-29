module['exports'] = function (options, callback) {

  var resource = require('resource'),
      html = require('html-lang'),
      forms = resource.use('forms'),
      rName = options.resource = options.resource || 'space',
      rMethod = options.method = options.method || 'all',
      display = options.display = options.display || 'index',
      r = resource.use(rName),
      $ = this.$,
      self = this;

  //
  // side nav
  //
  // add current resource to index button
  $('#indexDrop').html(rName);
  $('#indexDrop').attr('href', "/" + rName);
  // populate index dropdown
  var indexTmpl = '<li role="presentation"><a class="resourceIndex" role="menuitem" tabindex="-1" href=""></a></li>';
  // TODO get list of resources intelligently
  var resources = ['space','creature', 'gist', 'calendarEvent'];
  // for each resource,
  resources.forEach(function(resourceName) {
    // if this is not the current resource,
    if (resourceName !== rName) {
      // append to the index dropdown a link to that resource's index page
      $('#indexDropItems').append(html.render({
        'resourceIndex': resourceName,
        'resourceIndex.href': '/' + resourceName
      }, indexTmpl));
    }
  });

  // add methods
  var methodTmpl = '<li class="methodTab"><a class="methodLink" href=""></a></li>';
  // for each method,
  Object.keys(r.methods).sort().forEach(function(methodName) {
    // append resource to method nav
    $('#methodNav').append(html.render({
      'methodTab.class': (methodName === rMethod) ? 'active' : undefined,
      'methodLink': methodName,
      'methodLink.href': "/" + rName + "/" + methodName +
        ((options.data.id) ? ("?id=" + options.data.id) : "")
    }, methodTmpl));
  });

  // either delegate to resource view (if exists)
  // or default to using forms
  var delegate;
  // check if resource view exists
  if ((typeof r.view !== 'undefined') &&
    (typeof r.view[rMethod] !== 'undefined') &&
    (typeof r.view[rMethod][display] !== 'undefined')) {
    // TODO get rid of this hack because calling a view
    // directly shouldn't be a problem
    delegate = function(options, callback) {
      var viewObj = r.view[rMethod][display];
      return viewObj.present.call(viewObj, options, callback);
    };
  } else {
    delegate = forms.method;
  }

  //
  // make our error handling function
  //
  var handleErrorsAndReturn = function(err) {
    // catch all errors and pipe them back to the layout
    if (err) {

      // first accumulate the error messages
      var message = '';
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

    // return dom
    return callback(null, $.html());
  };

  //
  // now call the delegate we've decided on
  //
  // use a domain to catch errors
  var d = require('domain').create();
  // safety net for uncaught errors
  d.on('error', function(err) {

    // handle errors and return
    return handleErrorsAndReturn(err);
  });
  // call delegate
  d.run(function() {
    delegate(options, function(err, str) {

      // if we have content,
      if (str) {
        // add result of action to layout
        $('.content').html(str);
      }

      // also handle any errors and return
      return handleErrorsAndReturn(err);
    });
  });
};