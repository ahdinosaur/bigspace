var resource = require('resource'),
    view = resource.use('view'),
    space = resource.use('space'),
    creature = resource.define('creature');

creature.schema.description = "example resource for creatures like dragons, unicorns, and ponies";

creature.persist('memory');

function start() {
  var view = resource.use('view');
  view.create({ path: __dirname + '/view' }, function(err, _view) {
      creature.view = _view;
  });
}
creature.method('start', start, {
  description: "starts creature"
});

creature.property('name', {
  description: "name of the creature",
  type: 'string',
  required: false
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