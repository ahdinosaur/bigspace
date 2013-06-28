module['exports'] = function(options, callback) {

  var $ = this.$,
      resource = require('resource'),
      rName = options.resource || 'space',
      r = resource.use(rName);

  // present an informative index of all the spaces
  r.view.index.present(options, function(err, result) {

    // error handling
    if (err) {
      var message = '';

      // first accumulate the error messages
      if (err.errors) {
        err.errors.forEach(function(e){
          message += JSON.stringify(e);
        });
      } else {
        message += err.message;
      }

      // then display errors on layout
      $('#messageBar').append('<pre class="alert alert-error">' + err.stack + '</pre>');
    }

    $('#main').html(result);

    return callback(null, $.html());
  });
};