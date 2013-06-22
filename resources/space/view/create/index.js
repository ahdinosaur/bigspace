var resource = require('resource'),
    space = resource.use('space'),
    creature = resource.use('creature'),
    logger = resource.logger;

module['exports'] = function(options, callback) {
  var $ = this.$;

  // if create is to be run, run it
  if (options.data.run === 'true') {

    var spaceID = options.data.id,
        creatureID = options.request.session.creatureID,
        redirect =
          encodeURIComponent('/space?id=' + spaceID + '&action=get');

    options.response.redirect(
      'space/add?id=' + spaceID +
      '&resourceid=' + creatureID + '&resourceName=creature' +
      '&redirect=' + redirect +'&run=true'
    );

  // else just get the create view
  } else {
    // determine what view type is desired, default to detailed
    var type = options.data.type || 'detailed';
    space.view.create[type].present(options, function(err, result) {
      if (err) { callback(err); }
      callback(null, result);
    });
  }
};