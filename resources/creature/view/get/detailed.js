var resource = require('resource'),
    async = require('async'),
    html = require('html-lang'),
    fs = require('fs');

module['exports'] = function(options, callback) {

  var $ = this.$,
      self = this,
      creature = resource.use('creature'),
      space = resource.use('space');

  // get the creature we are viewing
  creature.get(options.data.id, function(err, creatureInst) {
    if (err) { return callback(err); }

    // generate creature's html from "detailed" template
    $.root().html(html.render({
      'creatureName': creatureInst.name,
      'creatureName.href': "creature?id=" + creatureInst.id,
      'creatureDescription': creatureInst.description
    }, self.template));

    // list this creature's spaces
    var appendSpace = function(spaceID, callback) {
      space.view.get.min.present({
        data: {
          id: spaceID
        }
      }, function(err, result) {
        if (err) { return callback(err); }
        $('.creatureSpaces').append(result);
        callback(null);
      });
    };
    async.each(creatureInst.spaces, appendSpace, function(err) {
      if (err) { return callback(err); }
      callback(null, $.html());
    });
  });
};