
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
  // top menu
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
       // TODO append id (if any) to href
      'methodLink.href': "/" + rName + "/" + methodName
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