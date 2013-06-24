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
      spaceIDs = options.data.id,
      resourceID = options.data.resourceid,
      redirect = options.data.redirect,
      resourceName = options.data.resourceName;

  if (typeof spaceIDs !== 'array' && typeof spaceIDs === 'string') {
    spaceIDs = [spaceIDs];
  }

  // for each of the given spaceIDs
  async.each(spaceIDs, function(spaceID, callback) {

    // get the space we are viewing
    space.get(spaceID, function(err, spaceInst) {
      if (err) { return callback(err); }

      // render and append this space's remove button
      $.root().append(html.render({
        'addToSpace': '+',
        'addToSpace.href': '/space/add?id=' + spaceInst.id +
          '&resourceid=' + resourceID + '&resourceName=' + resourceName +
          '&redirect=' + redirect +'&run=true'
      }, self.template));

      return callback(null);
    });
  }, function(err) {
    if (err) { return callback(err); }

    return callback(null, $.html());
  });
};