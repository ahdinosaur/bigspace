var resource = require('resource'),
    logger = resource.logger,
    async = require('async'),
    html = require('html-lang'),
    fs = require('fs');

module['exports'] = function(options, callback) {

  var $ = this.$;

  // TODO present an informative index of all the spaces

  callback(null, $.html());
};