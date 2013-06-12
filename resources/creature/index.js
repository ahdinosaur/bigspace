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

var join = function(options, callback) {
  /*
  returns {
    space: instance of space joined,
    newSpace: boolean of whether space is new,
    creature: instance of creature joining space,
    newCreature: boolean of whether creature is new to space
  }
  */
  var async = require('async'),
      creatureID = options.creatureID,
      spaceID = options.spaceID;

  async.waterfall([
    // get space, create if not already exists
    function(callback) {
      space.get(spaceID, function (err, _space) {
        if (err && (err.message === spaceID + " not found")) {
          // if space doesn't already exist, create it
          space.create({id: spaceID}, function(err, _space) {
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
    function(result, callback) {
      // add creature to space
      space.push({
        'spaceID': spaceID,
        'resource': creature,
        'resourceID': creatureID
      }, function(err, pushResult) {
        if (err) { return callback(err); }

        // add space to creature
        creature.get(creatureID, function(err, _creature) {
          if (err) { return callback(err); }

          // if creature doesn't have spaceID, push it
          if (_creature.spaces.indexOf(spaceID) === -1) {
            _creature.spaces.push(spaceID);
            _creature.save(function(err, _creature) {
              result.creature = _creature;
              result.newCreature = true;
              return callback(null, result);
            });
          // creature already has current spaceID
          } else {
            result.creature = _creature;
            result.newCreature = false;
            return callback(null, result);
          }
        });
      });
  }],
  function(err, result) {
    if (err) { return callback(err); }
    callback(null, result);
  });
};
creature.method('join', join, {
  description: "creature joins a space",
  properties: {
    options: {
      type: 'object',
      required: 'true',
      properties: {
        creatureID: {
          type: 'string',
          required: true
        },
        spaceID: {
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