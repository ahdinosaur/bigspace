var resource = require('resource');

module['exports'] = function (options, callback) {

  var $ = this.$;

  $('.user > .name').html('Bob');
  $('.user > .email').html('bob@bob.com');
  
  this.layout({
    layoutOptions: options,
    html: $.html()
  }, callback);
};
