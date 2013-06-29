var resource = require('resource'),
    async = require('async');

module['exports'] = function (options, callback) {

  options = options || {};
  var $ = this.$,
    self = this,
    r = resource.resources[options.resource];

  // all never needs additional data and always posts
  options.action = 'post';
  options.data = {};

  // call method view
  self.parent.method.present(options, callback);
};