var resource = require('resource'),
    async = require('async'),
    html = require('html-lang'),
    fs = require('fs');

module['exports'] = function(options, callback) {

  var $ = this.$,
      self = this,
      creature = resource.use('creature');

  // get the creature we are viewing
  creature.get(options.data.id, function(err, creatureInst) {
    if (err) { return callback(err); }

    $.root().html(html.render({
      'creatureName': creatureInst.name,
      'creatureName.href': "creature?id=" + creatureInst.id
    }, self.template));

    callback(null, $.html());
  });
};