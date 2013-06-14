var resource = require('resource'),
    async = require('async'),
    html = require('html-lang'),
    fs = require('fs');

module['exports'] = function(options, callback) {

  var $ = this.$,
      self = this,
      space = resource.use('space');

  // get the space we are viewing
  space.get(options.data.id, function(err, spaceInst) {
    if (err) { return callback(err); }

    $.root().html(html.render({
      'spaceID': spaceInst.id,
      'spaceID.href': "space?id=" + spaceInst.id
    }, self.template));

    callback(null, $.html());
  });
};