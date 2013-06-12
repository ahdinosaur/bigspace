var resource = require('resource'),
    logger = resource.logger,
    async = require('async'),
    html = require('html-lang'),
    fs = require('fs');

module['exports'] = function(options, callback) {

  var $ = this.$;

  callback(null, $.html());
};