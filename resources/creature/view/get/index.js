var resource = require('resource'),
    creature = resource.use('creature'),
    logger = resource.logger;

module['exports'] = function(options, callback) {
  var $ = this.$;

  var depth = options.data.depth || 'detailed';

  // determine what view depth is desired
  creature.view.get[depth].present(options, function(err, result) {
    if (err) { callback(err); }
    callback(null, result);
  });
};