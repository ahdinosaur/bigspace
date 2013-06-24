module['exports'] = function(options, callback) {

  var $ = this.$,
      resource = require('resource'),
      space = resource.use('space'),
      async = require('async');

  // get the space we are viewing
  space.get(options.data.id, function (err, _space) {
    if (err) { return callback(err); }

    // add space name
    $('.spaceID').html(_space.id);

    // for each resource class in the space
    async.each(Object.keys(_space.resources), function(resourceName, callback) {
      var _resource = resource.use(resourceName);

      // for each resource instance of class in the space
      async.each(_space.resources[resourceName], function(resourceID, callback) {

        // view the resource instance
        _resource.view.index.present({
          data: {
            id: resourceID,
            action: 'get',
            type: 'min'
          },
          layout: false
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
      return callback(null, $.html());
    });
  });
};