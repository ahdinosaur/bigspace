var resource = require('resource'),
    async = require('async'),
    html = require('html-lang'),
    fs = require('fs');

module['exports'] = function(options, callback) {

  var $ = this.$.load(''), // start with an empty dom
      self = this,
      space = resource.use('space');

  // if given a single id, turn it into an array for consistent typing
  // TODO: should this handle the case of an undefined ID?
  var spaceIDs = options.data.id;
  if (typeof spaceIDs !== 'array' && typeof spaceIDs === 'string') {
    spaceIDs = [spaceIDs];
  }

  // for each of the given spaceIDs
  async.each(spaceIDs, function(spaceID, callback) {
      console.log(spaceID);

    // get the space we are viewing
    space.get(spaceID, function(err, spaceInst) {
      if (err) { return callback(err); }

      // render and append this space
      $.root().append(html.render({
        'spaceID': spaceInst.id,
        'spaceID.href': "space?id=" + spaceInst.id,

        // add part button to rendered space
        // TODO: find a better view for this
        'partSpace': options.data.part ? 'x' : '',
        'partSpace.href': 'space?id=' + spaceID + '&part=true'
      }, self.template));

      callback(null);
    });
  }, function(err) {
    if (err) { return callback(err); }
    console.log("results!: ",$.html());
    callback(null, $.html());
  });
};