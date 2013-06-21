var resource = require('resource'),
    space = resource.use('space'),
    logger = resource.logger;

module['exports'] = function(options, callback) {
  var $ = this.$;

  // determine what view depth is desired, default to detailed
  var depth = options.data.depth || 'detailed';
  space.view.get[depth].present(options, function(err, result) {
    if (err) { callback(err); }
    callback(null, result);
  });
};