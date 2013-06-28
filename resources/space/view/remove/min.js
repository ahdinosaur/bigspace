module['exports'] = function(options, callback) {

  // if given a single id, turn it into an array for consistent typing
  // TODO: should this handle the case of an undefined ID?
  // TODO: make it so this can handle a single space / array of spaces as well
  var $ = this.$,
      self = this,
      resource = require('resource'),
      async = require('async'),
      html = require('html-lang'),
      url = require('url'),
      space = resource.use('space'),
      spaceID = options.data.spaceID,
      resourceID = options.data.resourceID,
      resourceName = options.data.resource,
      redirect = options.request.url;

  // if we are removing the space we are currently viewing, redirect to space index
  var currentSpaceID = url.parse(redirect, true).query.id;
  if (currentSpaceID === spaceID) {
    redirect = '/space';
  }

  // get the space we are viewing
  space.get(spaceID, function(err, spaceInst) {
    if (err) { return callback(err); }

    // render and append this space's remove button
    $.root().html(html.render({
      'removeFromSpace': 'x',
      'removeFromSpace.href': '/space/remove?spaceID=' + spaceInst.id +
        '&resourceID=' + resourceID + '&resource=' + resourceName +
        '&__redirect=' + encodeURIComponent(redirect) +'&__action=post'
    }, self.template));

    return callback(null, $.html());
  });
};