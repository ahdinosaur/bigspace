var resource = require('resource'),
    view = resource.use('view'),
    logger = resource.logger,
    space = resource.define('space');

space.schema.description = 'spaces provide a place to put/group resources';

space.persist('memory');

function start(options, callback) {
  // .view() convention
  var view = resource.use('view');
  view.create({ path: __dirname + '/view' }, function(err, _view) {
    if (err) { callback(err); }

    space.view = _view;

    // lazily define spaces property of resources
    // TODO figure out where resources array comes from
    var resources = ['creature']; //, 'text'];
    for (var i = 0; i < resources.length; i++) {
      resource[resources[i]].property('spaces', {
        description: "spaces resource is in",
        type: 'array',
        default: [],
        items: {
          type: 'string'
        }
      });
    }

    callback(null);
  });
}
space.method('start', start, {
  description: "starts space",
  properties: {
    options: {
      type: 'object'
    },
    callback: {
      type: 'function'
    }
  }
});

space.property('id', {
  description: 'the name of the space',
  type: 'string',
  required: true
});

space.property('resources', {
  description: 'the resources present in this space',
  type: 'object',
  default: {}
});

function add(options, callback) {
  /*
  returns {
    space: instance of space added,
    newSpace: boolean of whether space is new,
    resource: instance of resource adding to space,
    newResource: boolean of whether resource is new to space
  }
  */

  var async = require('async'),
      spaceID = options.spaceID,
      resourceClass = options.resource,
      resourceID = options.resourceID;
  // if resource is string, use resource
  if (typeof resourceClass === 'string') {
    resourceClass = resource.use(resourceClass);
  }


  async.waterfall([
    // get space, create if not already exists
    function(callback) {
      /* returns {
        space: instance of space added,
        newSpace: boolean of whether space is new,
      } */
      space.get(spaceID, function (err, _space) {
        if (err && (err.message === spaceID + " not found")) {
          // if space doesn't already exist, create it
          logger.info('space', spaceID, 'doesn\'t exist, creating');
          // TODO: make it so we don't have to init resources in empty
          space.create({id: spaceID, resources: {}}, function(err, _space) {
            if (err) { return callback(err); }
            return callback(null, {
              space: _space,
              newSpace: true
            });
          });
        } else if (err) {
          return callback(err);
        } else {
          return callback(null, {
            space: _space,
            newSpace: false
          });
        }
      });
    },
    // add resource to space
    function(result, callback) {
      /* returns {
        space: instance of space added,
        newSpace: boolean of whether space is new,
      } */
      var _space = result.space;

      // if space has none of this resource, init resource with [resourceID]
      if (typeof _space.resources[resourceClass.name] === 'undefined') {
        // add resource to space
        logger.info('initializing space', spaceID, 'with', resourceClass.name, resourceID);
        _space.resources[resourceClass.name] = [resourceID];

      // if space doesn't have resourceID, add it
      } else if (_space.resources[resourceClass.name].indexOf(resourceID) === -1) {
        logger.info('adding', resourceClass.name, resourceID, 'to space', spaceID);
        _space.resources[resourceClass.name].push(resourceID);
      }
      _space.save(function(err, _space) {
        if (err) { return callback(err); }
        logger.info('saved space', _space.id);
        return callback(null, {
          space: _space,
          newSpace: result.newSpace
        });
      });
    },
    // add space to resource
    function(result, callback) {
      /* returns {
        space: instance of space added,
        newSpace: boolean of whether space is new,
        resource: instance of resource adding space,
        newResource: boolean of whether resource is new to space
      } */

      // add space to resource
      resourceClass.get(resourceID, function(err, resourceInst) {
        if (err) { return callback(err); }
        // TODO don't assume every resource defaults 'spaces' property to []
        // TODO don't assume every resource has a 'spaces' property
        // if resource doesn't have spaceID, add it
        if (resourceInst.spaces.indexOf(spaceID) === -1) {
          logger.info('adding space', spaceID, 'to', resourceClass.name, resourceID);
          resourceInst.spaces.push(spaceID);
          resourceInst.save(function(err, resourceInst) {
            if (err) { return callback(err); }
            logger.info('saved', resourceClass.name, resourceID);
            result.resource = resourceInst;
            result.newResource = true;
            return callback(null, result);
          });
        // resource already has current spaceID
        } else {
          result.resource = resourceInst;
          result.newResource = false;
          return callback(null, result);
        }
      });
    }],
    function(err, result) {
      if (err) { return callback(err); }
      callback(null, result);
    });
}
space.method('add', add, {
  description: "adds a resource to a space",
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

function remove(options, callback) {
  /*
  returns {
    space: instance of space being removed,
    resource: instance of resource removed from space,
  }
  */

  var async = require('async'),
      spaceID = options.spaceID,
      resourceClass = options.resource,
      resourceID = options.resourceID;
  // if resource is string, use resource
  if (typeof resourceClass === 'string') {
    resourceClass = resource.use(resourceClass);
  }

  async.waterfall([
    // get space
    function(callback) {
      /* returns space */
      space.get(spaceID, callback);
    },
    // remove resource from space
    function(_space, callback) {
      /* returns space */

      // if space has none of this resource, init resource with [resourceID]
      if (typeof _space.resources[resourceClass.name] === 'undefined') {
        return callback(new Error(resourceClass.name + " resource not in space"));

      // if space has resourceID, remove it
      } else {
        var index = _space.resources[resourceClass.name].indexOf(resourceID);
        if (index === -1) {
          return callback(new Error(resourceClass.name + " resource not in space"));
        } else {
          logger.info('removing', resourceClass.name, resourceID, 'from space', spaceID);
          _space.resources[resourceClass.name].splice(index, 1);
          _space.save(function(err, _space) {
            if (err) { return callback(err); }
            logger.info('saved space', _space.id);
            return callback(null, _space);
          });
        }
      }
    },

    // remove space from resource
    function(_space, callback) {
      /* returns {
        space: instance of space from which resource was removeped,
        resource: instance of resource removeped from space
      } */
      resourceClass.get(resourceID, function(err, resourceInst) {
        if (err) { return callback(err); }

        // TODO don't assume every resource defaults 'spaces' property to []
        // TODO don't assume every resource has a 'spaces' property
        // if resource doesn't have spaceID, remove it
        var index = resourceInst.spaces.indexOf(spaceID);
        if (index === -1) {
          return callback(new Error("space " + spaceID + " not in resource"));
        } else {
          logger.info('removing space', spaceID, 'from', resourceClass.name, resourceID);
          resourceInst.spaces.splice(index, 1);
          resourceInst.save(function(err, resourceInst) {
            if (err) { return callback(err); }
            logger.info('saved', resourceClass.name, resourceID);
            return callback(null, {space: _space, resource: resourceInst});
          });
        }
      });
    }],
    function(err, result) {
      if (err) { return callback(err); }
      callback(null, result);
    });
}
space.method('remove', remove, {
  description: "removes a resource from a space",
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

space.dependencies = {
  'async': '*'
};

space.license = "AGPLv3";
exports.space = space;
