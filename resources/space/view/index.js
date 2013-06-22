var resource = require('resource'),
    logger = resource.logger;

module['exports'] = function(options, callback) {

  var $ = this.$,
      space = resource.use('space');

  // determine desired action of view, default to all
  var action = options.data.action || 'all';

  space.view[action].index.present(options, function(err, result) {

    if (options.layout !== false) {
      // display errors on layout
      if (err) { $('#error').append('<pre>' + err.stack + '</pre>'); }
      $('#main').html(result);
      return callback(null, $.html());
    } else {
      if (err) { return callback(err); }
      return callback(null, result);
    }
  });
};