var resource = require('resource'),
    logger = resource.logger,
    async = require('async'),
    html = require('html-lang'),
    fs = require('fs');

module['exports'] = function(options, callback) {

  var $ = this.$,
      spaceID = options.data.id,
      creatureID = options.request.session.creatureID,
      space = resource.use('space'),
      creature = resource.use('creature');

  // is the creature parting?
  if (options.data.part === 'true') {
    space.pop({
    'spaceID': spaceID,
    'resource': creature,
    'resourceID': creatureID
    }, function(err, result) {
      if (err) { throw err; }
      // redirect to index
      options.response.redirect('index');
    });
  }
  // the creature must be joining
  else {
    space.push({
    'spaceID': spaceID,
    'resource': creature,
    'resourceID': creatureID
    }, function(err, result) {
      if (err) { throw err; }
      // if we need to refresh space,
      // this happens if
      //   a) this is a new space
      //   b) creature is new to the space
      if ((result.newSpace === true) || (result.newResource === true)) {
        // refresh space
        // TODO find better way to refresh
        options.response.redirect('space?id=' + spaceID);
      }
      // view the space
      else {
        space.toView({id: spaceID}, function(err, result) {
          if (err) { throw err; }
          // add the space to the dom
          $('#space').html(result);
          // return
          callback(null, $.html());
        });
      }
    });
  }
};
