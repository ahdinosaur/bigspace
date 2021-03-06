module['exports'] = function(options, callback) {

  var $ = this.$,
      resource = require('resource'),
      space = resource.use('space');

  // determine what view type is desired, default to detailed
  var type = options.data.type || 'detailed';
  space.view.get[type].present(options, function(err, result) {
    if (err) { return callback(err); }
    return callback(null, result);
  });
};