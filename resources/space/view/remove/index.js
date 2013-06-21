var resource = require('resource'),
    url = require('url'),
    space = resource.use('space'),
    logger = resource.logger;

module['exports'] = function(options, callback) {
  var $ = this.$;

  // if remove is to be run, run it
  if (options.data.run === 'true') {
    var spaceID = options.data.id,
        resourceName = options.data.resourceName,
        redirect = options.data.redirect,
        resourceID = options.data.resourceid;

    // if we are removing the space we are currently viewing, redirect to space index
    var currentSpaceID = url.parse(redirect, true).query.id;
    if (currentSpaceID === spaceID) {
      // TODO: redirect to /space
      redirect = '/';
    }

    // get our space
    space.get(spaceID, function(err, _space) {
      if (err) { return callback(err); }

      // remove the resource from the space
      space.remove({
        'spaceID': spaceID,
        'resource': resourceName,
        'resourceID': resourceID
        }, function(err, result) {
          if (err) { return callback(err); }
          // send browser back from whence it came
          options.response.redirect(redirect);
      });
    });

  // else just get the remove view
  } else {
    // determine what view depth is desired, default to detailed
    var depth = options.data.depth || 'detailed';
    space.view.remove[depth].present(options, function(err, result) {
      if (err) { callback(err); }
      callback(null, result);
    });
  }
};