module['exports'] = function(options, callback) {

  var $ = this.$,
      resource = require('resource'),
      space = resource.use('space');

  // determine desired action of view, default to all
  var action = options.data.action || 'all';
  space.view[action].index.present(options, function(err, result) {

    // display errors on layout
    if (err) { $('#error').append('<pre>' + err.stack + '</pre>'); }

    if (options.layout !== false) {
      $('#main').html(result);
      return callback(null, $.html());
    } else {
      return callback(null, result);
    }
  });
};