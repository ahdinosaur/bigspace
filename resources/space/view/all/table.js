module['exports'] = function(options, callback) {

  var $ = this.$,
      resource = require('resource'),
      space = resource.use('space'),
      async = require('async');

  // TODO make this have more data, maybe count other resources too?
  // for each space, add the id and total creature-count to the table
  space.all(function(err, spaces) {
    if (err) { return callback(err); }

    async.each(spaces, function(_space, callback) {

      // get table-row view of the space
      space.view.get['table-row'].present({
        data: {
          id: _space.id
        }
      },

      // append rendered row to table
      function(err, result) {
        if (err) { return callback(err); }
        $('.table-body').append(result);
        return callback(null);
      });
    },

    // async.each's callback
    function(err) {
      if (err) { return callback(err); }
      return callback(null, $.html());
    });
  });
};