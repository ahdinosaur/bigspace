var resource = require('resource'),
    async = require('async');
require('js-object-clone');

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
          if (err) { return callback(err); }

          // use current instance to default options.data
          Object.keys(_r).forEach(function(key) {
            options.data[key] = options.data[key] || _r[key];
          });

          callback(null);
        });
      } else {
        callback(null);
      }
    },
    // call method view to handle rest of 'update' method
    function(callback) {
      self.parent.method.present(options, callback);
    }],
    // return result of method view
    callback);
};