module['exports'] = function(options, callback) {

  var $ = this.$,
      self = this,
      resource = require('resource'),
      creature = resource.use('creature'),
      space = resource.use('space'),
      async = require('async'),
      creatureID = options.data.id;

  // get the creature we are viewing
  creature.get(creatureID, function(err, creatureInst) {
    if (err) { return callback(err); }

    // get min of the creature
    creature.view.index.present({
      data: {
        id: creatureID,
        action: 'get',
        type: 'min'
      },
      layout: false
    },

    function(err, result) {
      if (err) { return callback(err); }

      // first add this creature's basic info
      $('.creatureMin').html(result);
      $('.description').html(creatureInst.description);

      // then, for each space this creature is in, get the min view and add it
      async.each(creatureInst.spaces, function(spaceID, callback) {

        // get min view of the space
        space.view.index.present({
          data: {
            id: spaceID,
            action: 'get',
            type: 'min'
          },
          layout: false
        },

        // append rendered space to template
        function(err, result) {
          if (err) { return callback(err); }
          $('.inSpaces').append(result + ' ');
          return callback(null);
        });
      },

      // async.each's callback
      function(err) {
        if (err) { return callback(err); }
        return callback(null, $.html());
      });
    });
  });
};