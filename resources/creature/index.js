var resource = require('resource'),
    view = resource.use('view'),
    space = resource.use('space'),
    creature = resource.define('creature');

creature.schema.description = "example resource for creatures like dragons, unicorns, and ponies";

creature.persist('memory');

creature.property('name', {
  description: "name of the creature",
  type: 'string',
  required: false
});

creature.property('spaces', {
  description: "spaces creature is in",
  type: 'array',
  default: [],
  items: {
    type: 'string'
  }
});

var toView = function(options, callback) {
  view.create({ path: __dirname + '/view' }, function(err, _view) {
    return _view.index.present(options, callback);
  });
};
creature.method('toView', toView, {
  description: "views creature",
  properties: {
    options: {
      type: 'object',
      required: 'true',
      properties: {
        id: {
          type: 'string',
          required: true
        }
      }
    },
    callback: {
      type: 'function',
      required: true
    }
  }
});

creature.dependencies = {
  'async': '*'
};
exports.creature = creature;