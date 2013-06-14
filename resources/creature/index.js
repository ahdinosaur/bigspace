var resource = require('resource'),
    view = resource.use('view'),
    space = resource.use('space'),
    creature = resource.define('creature');

creature.schema.description = "example resource for creatures like dragons, unicorns, and ponies";

creature.persist('memory');

function start(options, callback) {
  var view = resource.use('view');
  view.create({ path: __dirname + '/view' }, function(err, _view) {
      if (err) { callback(err); }
      creature.view = _view;
      callback(null);
  });
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