var resource = require('resource'),
    async = require('async'),
    html = require('html-lang'),
    Faker = require('Faker'),
    fs = require('fs');

module['exports'] = function(options, callback) {
  var space = resource.use('space'),
      creature = resource.use('creature');

  var $ = this.$;

  //
  // auth nav
  //
  var user =  options.request.user;
  if (typeof user !== 'undefined') {
    $('#auth-nav').html("<p>hi " + user.id + "</p>");
  } else {
    var auth = resource.use('auth');
    auth.view.login.min.present({}, function(err, result) {
      $('#auth-nav').html(result);
    });
  }

  var session = options.request.session || {};
  async.waterfall([
    //
    // all-spaces nav
    //
    function(callback) {

      // TODO: update the following once we can pass spaces into space.view.get.min
      // get all spaces
      space.all(function(err, spaces) {
        if (err) { return callback(err); }

        // retrieve each space id, then render them all
        async.map(spaces,
          function(_space, callback) {
              callback(null, _space.id);

          // render spaces
          }, function(err, spaces) {
            if (err) { return callback(err); }
            space.view.get.min.present({
              data: {
                id: spaces
              }

            // append rendered spaces to dom
            }, function(err, result) {
              if (err) { return callback(err); }
              $('#all-spaces-nav').append(result);
              callback(null);
            });
        });
      });
    },


    // get creatureID in session
    function(callback) {
      // if session does not yet have a creature, generate a random one
      if (typeof session.creatureID === 'undefined') {
        var creatureName = Faker.Name.lastName();
        creature.create({
          'name': creatureName,
          'description': Faker.Lorem.sentence()
        }, function(err, _creature) {
          if (err) { return callback(err); }
          // add creature to session
          session.creatureID = _creature.id;
          return callback(null, session.creatureID);
        });
      // if session has a creature
      } else {
        // use it
        callback(null, session.creatureID);
      }
    },

    // get creature from creatureID
    function(creatureID, callback) {
      creature.get(creatureID, callback);
    },

    //
    // top menu
    //
    // make creature buttons
    function(_creature, callback) {

      // get view of this creature
      creature.view.get.button.present({
        data: {
          id: _creature.id
        }
      }, function(err, result) {
        if (err) { return callback(err); }

        // append current creature as a button
        $('#top-menu').append(result);
      });
      callback(null, _creature);
    },

    //
    // in-spaces nav
    //
    function(_creature, callback) {
      // add spaces that creature is in to #in-spaces nav
      if (typeof _creature.spaces !== 'undefined') {

        space.view.get.button.present({
          data: {
            id: _creature.spaces,
            part: true
          }
        }, function(err, result) {
          if (err) { return callback(err); }

          // append rendered space with part button to dom
          $('#in-spaces-nav').append(result);
          callback(null);
        });
        }
    },

    // add form to add new spaces
    function(callback) {
      space.view.create.min.present({}, function(err, result) {
        if (err) { return callback(err); }
        $('#in-spaces-nav').append(result);
        return callback(null);
      });

    }],
    function (err) {
      // return layout
      if (err) { throw err; }
      callback(null, $.html());
    });
};
