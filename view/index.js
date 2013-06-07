var resource = require('resource'),
    creature = resource.use('creature'),
    forms = resource.use('forms');

module['exports'] = function(options, callback) {
  var $ = this.$;

  forms.generate({
    resource: 'creature',
    method: 'create'
  }, function(err, result) {
    if (err) { throw err; }

    $('.thing').html(result);

    callback(null, $.html());
  });

};
