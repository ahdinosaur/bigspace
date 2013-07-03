var resource = require('resource'),
    async = require('async');

module['exports'] = function (options, callback) {

  options = options || {};
  var $ = this.$,
    self = this,
    r = resource.resources[options.resource];

  var finish = function() {
    // call method view to handle rest of 'update' method
    return self.parent.method.present(options, callback);
  };

  if (options.id) {
    // if id is given, get object and use it to
    // set any undefined properties in options.data
    r.get(options.id, function(err, _r) {
      if (err) {
        options.err = err;
        return self.layout({
          layout: self.parent.parent.layout,
          layoutOptions: options,
          selector: "#forms-main",
          html: ""
        }, callback);
      }

      // use current instance to default options.data
      Object.keys(_r).forEach(function(key) {
        options.data[key] = options.data[key] || _r[key];
      });

      return finish();
    });
  } else {
    return finish();
  }
};