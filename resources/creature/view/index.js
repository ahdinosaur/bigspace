module['exports'] = function(options, callback) {

  var $ = this.$,
      resource = require('resource'),
      creature = resource.use('creature');

  //var user = options.request.user;
  //if (typeof user !== 'undefined') {
  //  console.log(user.creatures);
  //}

  // determine desired action of view, default to all
  var action = options.data.action || 'all';
  creature.view[action].index.present(options, function(err, result) {

    if (err) { return callback(err); }

    if (options.layout) {
      // TODO this requires nested layouts to work
      $('#main').html(result);
      return callback(null, $.html());
    } else {
      return callback(null, result);
    }
  });
};