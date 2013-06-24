module['exports'] = function(options, callback) {

  var $ = this.$,
      self = this,
      resource = require('resource'),
      space = resource.use('space'),
      html = require('html-lang'),
      spaceID = options.data.id;

  // get the space we are viewing
  space.get(spaceID, function(err, spaceInst) {
    if (err) { return callback(err); }

    // get min of the space
    space.view.index.present({
      data: {
        id: spaceID,
        action: 'get',
        type: 'min'
      },
      layout: false
    },
    // place rendered space in the row
    function(err, result) {
      if (err) { return callback(err); }

      var numCreatures = 0;
      if (typeof spaceInst.resources.creature !== 'undefined') {
        numCreatures = spaceInst.resources.creature.length;
      }

      $.root().html(html.render({
        'spaceMin': result,
        'numCreatures': numCreatures
      }, self.template));

      return callback(null, $.html());
    });
  });
};