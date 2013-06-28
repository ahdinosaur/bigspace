module['exports'] = function(options, callback) {

  // if given a single id, turn it into an array for consistent typing
  // TODO: should this handle the case of an undefined ID?
  // TODO: make it so this can handle a single space / array of spaces as well
  var $ = this.$,
      self = this,
      resource = require('resource'),
      async = require('async'),
      html = require('html-lang'),
      space = resource.use('space'),
      spaceID = options.data.id,
      resourceID = options.data.resourceid,
      redirect = options.data.redirect,
      resourceName = options.data.resourceName;

  // get the space we are viewing
  space.get(spaceID, function(err, spaceInst) {
    if (err) { return callback(err); }

    // render and append this space's remove button
    $.root().append(html.render({
      'addToSpace': '+',
      'addToSpace.href': '/space/add?id=' + spaceInst.id +
        '&resourceid=' + resourceID + '&resourceName=' + resourceName +
        '&__redirect=' + encodeURIComponent(redirect) +'&__action=post'
    }, self.template));

    return callback(null, $.html());
  });
};