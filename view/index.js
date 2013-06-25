module['exports'] = function(options, callback) {

  var $ = this.$,
      resource = require('resource'),
      rName = options.resource || 'space',
      r = resource.use(rName);

  // present an informative index of all the spaces
  r.view.index.present(options, function(err, result) {

    // display errors on layout
    if (err) { $('#error').append('<pre>' + err.stack + '</pre>'); }

    $('#main').html(result);

    return callback(null, $.html());
  });
};