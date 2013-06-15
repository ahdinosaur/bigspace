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
      if (err) { return callback(err); }
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
      if (err) { return callback(err); }
      // if we need to refresh space,
      // this happens if
      //   a) this is a new space
      //   b) creature is new to the space
      if ((result.newSpace === true) || (result.newResource === true)) {
        // refresh space
        // TODO find better way to refresh
        options.response.redirect('space?id=' + spaceID);
      }
      // view the space and available resources
      else {
        async.parallel([
          // view the space
          // TODO allow various zoom levels of space
          function(callback) {
            space.view.get.detailed.present({
                id: spaceID
              }, function(err, result) {
                if (err) { return callback(err); }
                // add the space to the dom
                $('#space').html(result);
                callback(null);
              });
          },

          //
          // resources nav
          //
          function(callback) {
            var resourceNames = ['space'];
            // for each resource
            async.each(resourceNames,
              // render
              function(resourceName, callback) {
                resource[resourceName].view.create.min.present({}, function(err, result) {
                  if (err) { return callback(err); }
                  $('#resources-nav').append(result);
                  callback(null);
                });
              },
              callback);
          }],
        function(err) {
          if (err) { return callback(err); }
          // return
          callback(null, $.html());
        });
      }
    });
  }
};
