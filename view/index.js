module['exports'] = function(options, callback) {

  var $ = this.$,
      resource = require('resource'),
      rName = options.resource || 'space',
      r = resource.use(rName);

  // present an informative index of all the spaces
  r.view.index.present({
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