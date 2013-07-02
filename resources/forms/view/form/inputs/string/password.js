//
// input fields for 'string' type, 'password' format
//
module['exports'] = function (options, callback) {

  var self = this,
      $ = self.$,
      input = options.control;

  $('input').attr('value', input.value.toString());
  $('input').attr('placeholder', input.description || '');

  return callback(null, $.html());
};
