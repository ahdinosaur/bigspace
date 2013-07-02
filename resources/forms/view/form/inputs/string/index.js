//
// input fields for 'string' types
//
module['exports'] = function (options, callback) {

  var self = this,
      $ = self.$,
      input = options.control;

  if(typeof input.error !== 'undefined') {
    $('.control-group').addClass('error');
    $('.help-inline').html(input.error.message);
  }

  $('.control-label').attr('for', input.name);
  $('.control-label').html(input.name);

  // create function of how to add what display view returns
  var addDisplay = function(err, result) {
    if (err) { return callback(err); }

    $('.controls').prepend(result);
    $('input').attr('id',  input.name);
    $('input').attr('name', input.name);
    $('input').attr('value', input.value.toString());

    return callback(null, $.html());
  };

  // delegate to string display views
  if (input.format) {
    return self.parent[input.format].present(options, addDisplay);
  } else {
    return self.parent.text.present(options, addDisplay);
  }
};
