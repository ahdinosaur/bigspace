var resource = require('resource'),
    logger = resource.logger,
    space = resource.use('space'),
    async = require('async'),
    html = require('html-lang'),
    fs = require('fs');

module['exports'] = function(options, callback) {

  var $ = this.$;

  // present an informative index of all the spaces
  space.view.index.present({
    data: {},
    layout: false
  },
  function(err, result) {

    // this should never err because the space index should handle it first
    if (err) { throw err; }

    $('#main').html(result);
    return callback(null, $.html());
  });
};