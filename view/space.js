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
  if (options.data.part === true) {
    creature.part({
    'creatureID': creatureID,
    'spaceID': spaceID
    }, function(err, result) {
      // redirect to index
      options.response.redirect('index');
    });
  }
  // the creature must be joining
  else {
    creature.join({
    'creatureID': creatureID,
    'spaceID': spaceID
    }, function(err, result) {
      // if we need to refresh space,
      // this happens if
      //   a) this is a new space
      //   b) creature just joined the space
      if ((result.newSpace === true) || (result.newCreature === true)) {
        // refresh space
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
