var resource = require('resource'),
    logger = resource.logger;

module['exports'] = function(options, callback) {

  var $ = this.$,
      creature = resource.use('creature');

  // determine what view type is desired, default to table
  var type = options.data.type || 'table';
  creature.view.all[type].present(options, function(err, result) {
    if (err) { return callback(err); }
    return callback(null, result);
  });
};