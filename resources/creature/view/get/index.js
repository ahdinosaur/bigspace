var resource = require('resource'),
    creature = resource.use('creature'),
    logger = resource.logger;

module['exports'] = function(options, callback) {
  var $ = this.$;

  // determine what view type is desired, default to detailed
  var type = options.data.type || 'detailed';
  creature.view.get[type].present(options, function(err, result) {
    if (err) { return callback(err); }
    return callback(null, result);
  });
};