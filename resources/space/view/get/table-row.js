var resource = require('resource'),
    space = resource.use('space'),
    html = require('html-lang'),
    logger = resource.logger;

module['exports'] = function(options, callback) {

  var $ = this.$,
      self = this,
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

      $.root().html(html.render({
        'spaceMin': result,
        'numCreatures': spaceInst.resources.creature.length
      }, self.template));

      return callback(null, $.html());
    });
  });
};