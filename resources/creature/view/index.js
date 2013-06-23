var resource = require('resource'),
    logger = resource.logger;

module['exports'] = function(options, callback) {

  var $ = this.$,
      creature = resource.use('creature');

  //var user = options.request.user;
  //if (typeof user !== 'undefined') {
  //  console.log(user.creatures);
  //}

  // determine desired action of view, default to all
  var action = options.data.action || 'all';
  creature.view[action].index.present(options, function(err, result) {

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