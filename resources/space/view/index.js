module['exports'] = function(options, callback) {

  var $ = this.$,
      resource = require('resource'),
      space = resource.use('space');

  // determine desired action of view, default to all
  var action = options.data.action || 'all';
  space.view[action].index.present(options, function(err, result) {

    if (err) { return callback(err); }

    if (options.layout) {
      $('#main').html(result);
      return callback(null, $.html());
    } else {
      return callback(null, result);
    }
  });
};