var resource = require('resource'),
    fs = require('fs');

module['exports'] = function(options, callback) {
  var $ = this.$;

  var user =  options.request.user;

  if (typeof user !== 'undefined') {
    $('#header').html("<p>hi " + user.email + "</p>");
  } else {
    $('#header').html(fs.readFileSync(__dirname + '/login.html'));
  }

  callback(null, $.html());
};
