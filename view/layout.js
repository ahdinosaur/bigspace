var resource = require('resource'),
    async = require('async'),
    html = require('html-lang'),
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
      // get all spaces
      space.all(function(err, spaces) {
        if (err) { return callback(err); }
        // for each space
        async.each(spaces,
          function(_space, callback) {
            // render space
            space.view.get.min.present({
              data: {
                id: _space.id
              }
            }, function(err, result) {
              if (err) { return callback(err); }
              // append rendered space to dom
              $('#all-spaces-nav').append(result);
              callback(null);
          });
        }, callback);
      });
    },

    // add form to add new spaces
    // TODO: this should be in "create min" or something.
    function(callback) {
      $('#all-spaces-nav').append("<div class='pure-u-1-6'><form action='space'><input type='text' name='id' size='16' /><input type='submit' value='join' /></form></div>");
      callback(null);
    },

    // get creatureID in session
    function(callback) {
      // if session does not yet have a creature
      if (typeof session.creatureID === 'undefined') {
        // TODO create a random creature
        creature.create({name: 'bob', description: 'the bob creature'}, function(err, _creature) {
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
    // creature nav
    //
    function(_creature, callback) {
      // render creature
      creature.view.get.min.present({
        data: {
          id: _creature.id
        }
      }, function(err, result) {
        if (err) { return callback(err); }
        // append rendered creature to dom
        $('#creatures-nav').append(result);
        callback(null, _creature);
      });
    },

    //
    // in-spaces nav
    //
    function(_creature, callback) {
      // add spaces that creature is in to #in-spaces nav
      if (typeof _creature.spaces !== 'undefined') {

        space.view.get.min.present({
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


        // for each space
        //async.each(_creature.spaces,
        //  function(spaceID, callback) {
        //    // render space
        //    space.view.get.min.present({
        //      data: {
        //        id: spaceID
        //      }
        //    }, function(err, result) {
        //      if (err) { return callback(err); }
        //      // add part button to rendered space
        //      var dom = $.load(result);
        //      dom('.space').append('<a href="space?id=' + spaceID + '&part=true">x</a>');
        //      // append rendered space with part button to dom
        //      $('#in-spaces-nav').append(dom.html());
        //      callback(null);
        //    });
        //  }, callback);

        }
    }],
    function (err) {
      // return layout
      if (err) { throw err; }
      callback(null, $.html());
    });
};
