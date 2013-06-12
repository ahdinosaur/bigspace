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
    $('#header').html("<p>hi " + user.id + "</p>");
  } else {
    $('#header').html(fs.readFileSync(__dirname + '/login.html'));
  }

  //
  // all-spaces nav
  //
  // TODO make async
  space.all(function(err, spaces) {
    if (err) { throw err; }
    var tmpl = "<div class='pure-u-1-6'><a href='' class='spaceID'></a></div>";

    // add each space to the nav
    spaces.forEach(function(_space) {
      $('#all-spaces').append(html.render({
        'spaceID': _space.id,
        'spaceID.href': 'space?id=' + _space.id
      }, tmpl));
    });
  });
  $('#all-spaces').append("<form action=\"space\"><input type=\"text\" name=\"id\" /><input type=\"submit\" /></form>");

  var session = options.request.session || {};
  async.waterfall([
    // get creatureID in session
    function(callback) {
      // if session does not yet have a creature
      if (typeof session.creatureID === 'undefined') {
        // TODO create a random creature
        creature.create({name: 'bob'}, function(err, _creature) {
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
    // add creature to creature nav
    function(_creature, callback) {
      //
      // creature nav
      //
      // add creatures to the creature bar
      $('#creatures').append(_creature.name);
      callback(null, _creature);
    },
    function(_creature, callback) {
      // add spaces that creature is in to #in-spaces nav
      //
      // in-spaces nav
      //
      // TODO make async
      var tmpl = "<div class='pure-u-1-6'><a href='' class='joinSpace'></a> <a href='' class='partSpace'></a></div>";

      // add each space to the nav
      _creature.spaces.forEach(function(spaceID) {
        $('#in-spaces').append(html.render({
          'joinSpace': spaceID,
          'joinSpace.href': 'space?id=' + spaceID,
          'partSpace': 'x',
          'partSpace.href': 'space?id=' + spaceID + "&part=true"
        }, tmpl));
      });
      callback(null, _creature);
    }],
    function (err) {
      // return
      if (err) { return callback(err); }
      callback(null, $.html());
    });
};
