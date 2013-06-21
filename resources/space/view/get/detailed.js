var resource = require('resource'),
    space = resource.use('space'),
    async = require('async'),
    html = require('html-lang'),
    fs = require('fs');

module['exports'] = function(options, callback) {
  var $ = this.$;

  // get the space we are viewing
  space.get(options.data.id, function (err, _space) {

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
            depth: 'min'
          },
          layout: false
        }, function(err, result) {
          if (err) { return callback(err); }
          // append to dom
          $('.spaceResources').append('<li>' + result + '</li>');
          callback(null);
        });

      // end instance each
      }, function(err) {
        callback(err);
      });

    // end class each
    }, function(err) {
      if (err) { return callback(err); }
      callback(null, $.html());
    });
  });
};