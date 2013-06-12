var resource = require('resource'),
    view = resource.use('view'),
    space = resource.define('space');

space.schema.description = 'spaces provide a place to put/group resources';

space.persist('memory');

space.property('id', {
  description: 'the name of the space',
  type: 'string',
  required: true
});

space.property('resources', {
  description: 'the resources present in this space',
  type: 'object',
  default: {},
  required: true
});

function push(options, callback) {

  var _resource = options.resource,
      resourceID = options.resourceID;
  // if resource is string, use resource
  if (typeof _resource === 'string') {
    _resource = resource.use(_resource);
  }

  // get space
  space.get(options.spaceID, function(err, _space) {
    if (err) { return callback(err); }

    // if space has none of this resource, init resource with [resourceID]
    if (typeof _space.resources[_resource.name] === 'undefined') {
      // add resource to space
      _space.resources[_resource.name] = [resourceID];
      _space.save(callback);

    // if space doesn't have resourceID, push it
    } else if (_space.resources[_resource.name].indexOf(resourceID) === -1) {
      _space.resources[_resource.name].push(resourceID);
      _space.save(callback);

    // space already has current resource
    } else {
      callback(null, _space);
    }
  });
}
space.method('push', push, {
  description: "pushes a resource into a space",
  properties: {
    options: {
      type: 'object',
      required: 'true',
      properties: {
        spaceID: {
          type: 'string',
          required: true
        },
        resource: {
          type: 'any',
          required: true
        },
        resourceID: {
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

function toView(options, callback) {
  view.create({ path: __dirname + '/view' }, function(err, _view) {
    return _view.index.present(options, callback);
  });
}

space.method('toView', toView, {
  description: "views space",
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



space.dependencies = {};

space.license = "AGPLv3";
exports.space = space;
