module['exports'] = function(options, callback) {

  var $ = this.$;
      resource = require('resource'),
      space = resource.use('space'),
      creature = resource.use('creature');

  // if create is to be run, run it
  if (options.data.run === 'true') {

    var spaceID = options.data.id,
        creatureID = options.request.session.creatureID,
        redirect =
          encodeURIComponent('/space/get?id=' + spaceID);

    options.response.redirect(
      '/space/add?spaceID=' + spaceID +
      '&resourceID=' + creatureID + '&resource=creature' +
      '&__redirect=' + redirect +'&__action=post'
    );

  // else just get the create view
  } else {
    // determine what view type is desired, default to detailed
    var type = options.data.type || 'detailed';
    space.view.create[type].present(options, function(err, result) {
      if (err) { return callback(err); }
      return callback(null, result);
    });
  }
};