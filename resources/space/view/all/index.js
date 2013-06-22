var resource = require('resource'),
    logger = resource.logger;

module['exports'] = function(options, callback) {

  var $ = this.$,
      space = resource.use('space');

  // determine what view type is desired, default to table
  var type = options.data.type || 'table';
  space.view.all[type].present(options, function(err, result) {
    if (err) { return callback(err); }
    return callback(null, result);
  });
};