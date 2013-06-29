var resource = require('resource'),
    async = require('async');

module['exports'] = function (options, callback) {

  options = options || {};
  var $ = this.$,
    self = this,
    r = resource.resources[options.resource];

  async.waterfall([
    // if id is given, get object and use it to
    // set any undefined properties in options.data
    function(callback) {
      if (options.id) {
        r.get(options.id, function(err, _r) {

          // if we can't find the resource, continue
          if (err && (err.message === options.id + " not found")) {
            return callback(null);

          // standard error case
          } else if (err) {
            return callback(err);

          // if we did fid the resource,
          // use current instance to default options.data
          } else {
            Object.keys(_r).forEach(function(key) {
              options.data[key] = options.data[key] || _r[key];
            });
            callback(null);
          }
        });

      // if we weren't given an id, continue
      } else {
        callback(null);
      }
    },

    // call method view to handle rest of 'updateOrCreate' method
    function(callback) {
      self.parent.method.present(options, callback);
    }],

    // return result of method view
    callback);
};