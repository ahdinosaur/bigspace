var resource = require('resource'),
    async = require('async'),
    html = require('html-lang'),
    fs = require('fs');

module['exports'] = function(options, callback) {

  var $ = this.$,
      creature = resource.use('creature');

  // get the creature we are viewing
  creature.get(options.id, function(err, creatureInst) {
    if (err) { return callback(err); }

    $('.creature').html(creatureInst.name);

    callback(null, $.html());
  });
};