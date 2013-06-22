var resource = require('resource'),
    async = require('async'),
    html = require('html-lang'),
    fs = require('fs');

module['exports'] = function(options, callback) {

  var $ = this.$.load(''), // start with an empty dom
      self = this,
      space = resource.use('space');

  // if given a single id, turn it into an array for consistent typing
  // TODO: this should handle the case of an undefined
  // TODO: make it so this can handle a single space instance 
  //       or array of space instances as well
  // for the above, consider changing data.id to data.space
  var spaceIDs = options.data.id;
  if (typeof spaceIDs !== 'array' && typeof spaceIDs === 'string') {
    spaceIDs = [spaceIDs];
  }

  // for each of the given spaceIDs
  async.each(spaceIDs, function(spaceID, callback) {

    // get the space we are viewing
    space.get(spaceID, function(err, spaceInst) {
      if (err) { return callback(err); }

      // render and append this space
      $.root().append(html.render({
        'spaceID': '#' + spaceInst.id,
        'spaceID.href': "/space?id=" + spaceInst.id + '&action=get'
      }, self.template));

      return callback(null);
    });
  }, function(err) {
    if (err) { return callback(err); }

    return callback(null, $.html());
  });
};