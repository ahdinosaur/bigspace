var resource = require('resource'),
    space = resource.use('space'),
    logger = resource.logger;

module['exports'] = function(options, callback) {
  var $ = this.$;

  var depth = options.data.depth || 'detailed';

  // determine what view depth is desired
  space.view.create[depth].present(options, function(err, result) {
    if (err) { callback(err); }
    callback(null, result);
  });
};