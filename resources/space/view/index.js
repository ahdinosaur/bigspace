var resource = require('resource'),
    logger = resource.logger;

module['exports'] = function(options, callback) {

  var $ = this.$,
      space = resource.use('space');

  // determine desired action of view, default to get
  var action = options.data.action || 'get';

  space.view[action].index.present(options, function(err, result) {
    if (err) { callback(err); }
    if (options.layout !== false) {
      $('#main').html(result);
      callback(null, $.html());
    } else {
      callback(null, result);
    }
  });
};