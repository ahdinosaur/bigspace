module['exports'] = function(options, callback) {

  var $ = this.$,
      resource = require('resource'),
      space = resource.use('space'),
      async = require('async');


  // get the space we are viewing
  space.get(options.data.id, function (err, _space) {
    if (err) { return callback(err); }
    async.series([

      // in order for a creature to get the detailed view of a space,
      // that creature must be in that space.
      function(callback) {
        var creatureID = options.request.session.creatureID;
        // the creature is not in the space,
        if (!_space.resources.creature || _space.resources.creature.indexOf(creatureID) === -1) {

          // add the creature to the space
          space.add({
            'spaceID': _space.id,
            'resource': 'creature',
            'resourceID': creatureID
            }, function(err, result) {
              if (err) { return callback(err); }
              // TODO: figure out a cleaner way to do this. redirect is necessary
              //       for the in-spaces nav to contain this new space
              options.response.redirect(options.request.url);
          });
        } else {
          return callback(null);
        }
      },

      // continue on after asserting that the creature is in this space
      function(callback) {

        // add space name to the template of returned html
        $('.spaceID').html(_space.id);

        // for each resource class in the space
        async.each(Object.keys(_space.resources), function(resourceName, callback) {
          var _resource = resource.use(resourceName);

          // for each resource instance of class in the space
          async.each(_space.resources[resourceName], function(resourceID, callback) {

            // view the resource instance
            _resource.view.get.min.present({
              data: {
                id: resourceID
              }
            }, function(err, result) {
              if (err) { return callback(err); }
              // append to dom
              $('.spaceResources').append('<li>' + result + '</li>');
              return callback(null);
            });

          // end instance each
          }, function(err) {
            return callback(err);
          });

        // end class each
        }, function(err) {
          if (err) { return callback(err); }
          return callback(null);
        });
      }
    ],

    // async.series's callback
    function(err) {
      if (err) { return callback(err); }
      return callback(null, $.html());
    });
  });
};