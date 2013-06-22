var resource = require('resource'),
    async = require('async'),
    html = require('html-lang'),
    Faker = require('Faker'),
    fs = require('fs');

module['exports'] = function(options, callback) {
  var space = resource.use('space'),
      creature = resource.use('creature');

  var $ = this.$;

  var session = options.request.session || {};
  async.waterfall([
    //
    // auth nav
    //
    function(callback) {
      var auth = resource.use('auth');
      auth.view.login.present({anchor: 'right'}, function(err, result) {
        if (err) return callback(err);
        $('#authNav').html(result);
        return callback(null);
      });
    },
    // add user info if logged in
    function(callback) {
      var user =  options.request.user,
          tmpl = "hi <a href='' class='userID'></a>!";
      if (typeof user !== 'undefined') {
        $('#userInfo').html(html.render({
          "userID": user.id,
          "userID.href": "user?id=" + user.id
        }, tmpl));
      }
      return callback(null);
    },
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
            space.view.index.present({
              data: {
                id: spaces,
                action: 'get',
                depth: 'min'
              },
              layout: false

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
        var creatureName = Faker.Name.firstName() + " " + Faker.Name.lastName();
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
      creature.view.index.present({
        data: {
          id: _creature.id,
          action: 'get',
          depth: 'min'
        },
        layout: false
      }, function(err, result) {
        if (err) { return callback(err); }

        // append current creature as a button
        $('#top-menu').append('<li>' + result + '</li>');
      });
      callback(null, _creature);
    },

    //
    // in-spaces nav
    //
    // add spaces that creature is in to #in-spaces nav
    function(_creature, callback) {
      if (typeof _creature.spaces !== 'undefined') {

        // view all spaces, with remove button
        async.eachSeries(_creature.spaces, function(spaceID, callback) {

          async.series([
            // append this space's view
            function (callback) {
              space.view.index.present({
                data: {
                  id: spaceID,
                  action: 'get',
                  depth: 'min'
                },
                layout: false
              }, function(err, result) {
                if (err) { return callback(err); }
                // append rendered space to dom
                $('#in-spaces-nav').append('<li>' + result + '</li>');
                callback(null);
              });
            },

            function (callback) {
              // append this space's remove button
              space.view.index.present({
                data: {
                  id: spaceID,
                  action: 'remove',
                  resourceid: _creature.id,
                  resourceName: 'creature',
                  redirect: options.request.url,
                  depth: 'min'
                },
                layout: false
              }, function(err, result) {
                if (err) { return callback(err); }
                // append rendered remove button to dom
                $('#in-spaces-nav').append('<li>' + result + '</li>');
                callback(null);
              });

          // series callback
          }], callback);

        // each callback
        }, callback);
      }
    },

    // add form to add new spaces
    function(callback) {
      space.view.index.present({
        data: {
          action: 'create',
          depth: 'min'
        },
        layout: false
      }, function(err, result) {
        if (err) { return callback(err); }
        $('#in-spaces-nav').append(result);
        return callback(null);
      });

    }],
    function (err) {

      // display errors on layout
      if (err) { $('#error').append('<pre>' + err.stack + '</pre>'); }

      callback(null, $.html());
    });
};
