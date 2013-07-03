module['exports'] = function(options, callback) {

  var $ = this.$,
      resource = require('resource'),
      async = require('async'),
      html = require('html-lang'),
      Faker = require('Faker'),
      space = resource.use('space'),
      creature = resource.use('creature'),
      rName = "space",
      r = resource.use(rName),
      rMethod = "get";

  var session = options.request.session || {};
  async.waterfall([
    //
    // auth nav
    //
    function(callback) {
      var auth = resource.use('auth');
      auth.view.login.present({}, function(err, result) {
        if (err) return callback(err);
        $('#authNav').html(result);
        return callback(null);
      });
    },
    /*
    TODO fix for new layout by integrating into authNav
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
    },*/

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

    // make creature buttons
    function(_creature, callback) {

      // get view of this creature
      creature.view.get.min.present({
        data: {
          id: _creature.id
        }
      }, function(err, result) {
        if (err) { return callback(err); }

        // append current creature as a button
        $('#creaturePageButton').html(result);
      });
      return callback(null, _creature);
    },

    //
    // in-spaces nav
    //
    // add spaces that creature is in to #in-spaces nav
    function(_creature, callback) {
      if (typeof _creature.spaces !== 'undefined') {

        space.view.get.tabs.present({
          data: {
            creatureID: _creature.id,
            spaces: _creature.spaces
          },
          request: options.request,
          response: options.response
        }, function(err, result) {
          $('#inSpacesNav').html(result);
          return callback(null);
        });
      }
    }],
    function (err) {
      //
      // make our error handling function
      //
      // catch all errors and pipe them back to the layout
      if (err) {
        // then display errors on layout
        $('#messageBar').append('<pre class="alert alert-error">' + err.stack + '</pre>');
      }
      if (options.err) {
        // then display errors on layout
        $('#messageBar').append('<pre class="alert alert-error">' + options.err.stack + '</pre>');
      }

      // return dom
      return callback(null, $.html());
    });
};
