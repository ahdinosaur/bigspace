var resource = require('resource'),
    logger = resource.logger,
    async = require('async'),
    html = require('html-lang'),
    forms = resource.use('forms');

module['exports'] = function(options, callback) {
  var $ = this.$;

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