module['exports'] = function(options, callback) {

  var $ = this.$,
      resource = require('resource'),
      space = resource.use('space');

  // present an informative index of all the spaces
  space.view.index.present({
    data: {},
    layout: false
  },
  function(err, result) {

    // this should never error because the space index should handle it first
    if (err) { throw err; }

    $('#main').html(result);
    return callback(null, $.html());
  });
};