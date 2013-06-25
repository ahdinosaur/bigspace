var resource = require('resource');

module['exports'] = function (options, callback) {

  var r = resource.use(options.resource),
      $ = this.$,
      output = '',
      record = options.data;

    // if this is a post request, perform the destroy
    if (options.action === "post") {
      //
      // Todo: perform check if record exists
      //
      r.destroy(options.id, function(err, result){
        // TODO: check result for confirmation of destruction
        $('.message').html('Destroyed!');
        $('form').remove();
        return callback(null, $.html());
      });

    // else just provide a view of the destroy
    } else {
      if (typeof record === "object") {
        Object.keys(record).reverse().forEach(function(key){
          $('.inputs').prepend("<label for='" + key + "'>" + key + "</label><input name ='" + key + "' value='" + record[key] + "'/><br/>");
        });
      } else if (typeof options.id !== 'undefined') {
        $('.confirm').html('Destroy ' + options.id + '?');
      }
      return callback(null, $.html());
    }
};
