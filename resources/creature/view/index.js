var resource = require('resource'),
    logger = resource.logger;

module['exports'] = function(options, callback) {
  var $ = this.$,
      creature = resource.use('creature');

  //var user = options.request.user;
  //if (typeof user !== 'undefined') {
  //  console.log(user.creatures);
  //}

  // determine desired action of view, default to get
  var action = options.data.action || 'get';
  creature.view[action].index.present(options, function(err, result) {

    // display errors on layout
    if (err) { $('#error').append('<pre>' + err.stack + '</pre>'); }

    if (options.layout !== false) {
      $('#main').html(result);
      callback(null, $.html());
    } else {
      callback(null, result);
    }
  });
};