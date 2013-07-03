var resource = require('resource');

module['exports'] = function (options, callback) {

  var $ = this.$;

  $('.user > .name').html('Bob');
  $('.user > .email').html('bob@bob.com');

  this.parent.layout.template = '<h1>big</h1><div id="main"></div>';

  this.layout({
    layoutOptions: options,
    html: $.html()
  }, callback);
};
