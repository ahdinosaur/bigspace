module['exports'] = function(options, callback) {

  var $ = this.$,
      resource = require('resource'),
      creature = resource.use('creature'),
      async = require('async');

  // TODO make this have more data, maybe count other resources too?
  // for each creature, add the name, description, and total spaces-count to the table
  creature.all(function(err, creatures) {
    if (err) { return callback(err); }

    async.each(creatures, function(_creature, callback) {

      // get table-row view of the creature
      creature.view.get['table-row'].present({
        data: {
          id: _creature.id
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