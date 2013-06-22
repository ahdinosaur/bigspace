var resource = require('resource'),
    space = resource.use('space'),
    creature = resource.define('creature');

creature.schema.description = "resource for user-controlled creatures like dragons, unicorns, and ponies";

creature.persist('memory');

// .start() convention
function start(options, callback) {
  var async = require('async');

  async.parallel([
    // setup .view convention
    function(callback) {
      var view = resource.use('view');
      view.create({ path: __dirname + '/view' }, function(err, _view) {
          if (err) { return callback(err); }
          creature.view = _view;
          return callback(null);
      });
    },
    // add creatures property to user resource
    function(callback) {
      var user = resource.use('user');
      user.property('creatures', {
        description: 'user controlled creatures',
        type: 'array',
        items: {
          type: 'string',
          description: 'creature id'
        },
        default: []
      });
      user.persist('memory');
      return callback(null);
    }], callback);
}
creature.method('start', start, {
  description: "starts creature"
});

creature.property('name', {
  description: "name of the creature",
  type: 'string',
  required: true
});

creature.property('description', {
  description: "description of the creature",
  type: 'string',
  required: false,
  default: ''
});

// TODO remove
creature.property('spaces', {
  description: "spaces creature is in",
  type: 'array',
  default: [],
  items: {
    type: 'string'
  }
});

creature.dependencies = {
  'async': '*'
};
exports.creature = creature;
