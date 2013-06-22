var resource = require('resource'),
    space = resource.use('space'),
    logger = resource.logger;

module['exports'] = function(options, callback) {
  var $ = this.$;

  // if add is to be run, run it
  if (options.data.run === 'true') {
    var spaceID = options.data.id,
        resourceName = options.data.resourceName,
        redirect = options.data.redirect,
        resourceID = options.data.resourceid;

    // add the resource to the space
    space.add({
      'spaceID': spaceID,
      'resource': resourceName,
      'resourceID': resourceID
      }, function(err, result) {
        if (err) { return callback(err); }
        // send browser back from whence it came
        options.response.redirect(redirect);
    });

  // else just get the add view
  } else {
    // determine what view type is desired, default to detailed
    var type = options.data.type || 'detailed';
    space.view.add[type].present(options, function(err, result) {
      if (err) { callback(err); }
      callback(null, result);
    });
  }
};