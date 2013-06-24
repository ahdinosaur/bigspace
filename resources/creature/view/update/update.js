module['exports'] = function(options, callback) {

  var $ = this.$,
      resource = require('resource'),
      forms = resource.use('forms');

  // generate creature update forms
  forms.generate({
    resource: 'creature',
    method: 'update',
    id: options.data.id
  }, function(err, result) {
    if (err) { return callback(err); }
    $('.creature').html(result);

    // remove forms of fields which should remain unmodified
    //$('#id').remove();
    //$('#spaces').remove();

    return callback(null, $.html());
  });
};