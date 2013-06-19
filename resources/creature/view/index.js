var resource = require('resource'),
    logger = resource.logger;

module['exports'] = function(options, callback) {
  var $ = this.$,
      creature = resource.use('creature');

  console.log(options.request.user);

  creature.view.get.detailed.present(options, function(err, result) {
    if (err) { callback(err); }

    // TODO is there a better way?
    $('#main').html(result);

    callback(null, $.html());
  });
};