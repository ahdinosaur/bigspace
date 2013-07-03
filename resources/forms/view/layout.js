module['exports'] = function (options, callback) {

  var resource = require('resource'),
      html = require('html-lang'),
      rName = options.resource = options.resource,
      rMethod = options.method,
      display = options.display,
      data = options.data = options.data || {},
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
  // i think the most intelligent way would be to listen for future resource.use resources
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

  if (resource.layout) {
    return self.layout({
      layout: resource.layout.view.layout,
      layoutOptions: options,
      html: $.html()
    }, callback);
  } else {
    return callback(options.error, $.html());
  }
};