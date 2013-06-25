module['exports'] = function(options, callback) {

  var $ = this.$,
      resource = require('resource'),
      async = require('async'),
      html = require('html-lang'),
      Faker = require('Faker'),
      space = resource.use('space'),
      creature = resource.use('creature');

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
        return callback(null, session.creatureID);
      }
    },

    // get creature from creatureID
    function(creatureID, callback) {
      creature.get(creatureID, callback);
    },

    //
    // top menu
    //
    // make index button
    function(_creature, callback) {

      // for each resource,
      async.each(['space','creature'],

        // append to the dropdown a link to that resource's index page
        function(resourceName, callback) {
          $('#resourceIndexes').append('<li><a href="/' + resourceName + '">' +
            resourceName + '</a></li>');
          return callback(null);
        },

        // return dom
        function(err) {
          if (err) { return callback(err); }
          return callback(null, _creature);
        });
    },

    // make creature buttons
    function(_creature, callback) {

      // get view of this creature
      creature.view.get.min.present({
        data: {
          id: _creature.id
        },
        layout: false
      }, function(err, result) {
        if (err) { return callback(err); }

        // append current creature as a button
        $('#top-menu').append('<li>' + result + '</li>');
      });
      return callback(null, _creature);
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
              space.view.get.min.present({
                data: {
                  id: spaceID
                },
                layout: false
              }, function(err, result) {
                if (err) { return callback(err); }
                // append rendered space to dom
                $('#in-spaces-nav').append('<li>' + result + '</li>');
                return callback(null);
              });
            },

            function (callback) {
              // append this space's remove button
              space.view.remove.min.present({
                data: {
                  id: spaceID,
                  resourceid: _creature.id,
                  resourceName: 'creature',
                  redirect: options.request.url
                },
                layout: false
              }, function(err, result) {
                if (err) { return callback(err); }
                // append rendered remove button to dom
                $('#in-spaces-nav').append('<li>' + result + '</li>');
                return callback(null);
              });

          // series callback
          }], callback);

        // each callback
        }, callback);
      }
    },

    // add form to add new spaces
    function(callback) {
      space.view.create.min.present({
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
      return callback(null, $.html());
    });
};
