var resource = require('resource'),
    http = resource.use('http'),
    view = resource.use('view'),
    logger = resource.logger,
    un = resource.define('un');

un.schema.description = 'un makes big easy';

function start(options, callback) {

  // create view that should contain index and layout
  view.create({ path: options.path }, function(err, _view) {

    // modify view to include all resource views
    // TODO figure out where resources array comes from
    var resources = ['space', 'creature'];
    for (var i = 0; i < resources.length; i++) {
      _view[resources[i]] = resource[resources[i]].view;
      if (typeof _view[resources[i]].index !== 'undefined') {
        _view[resources[i]].index.parent = _view;
      }
    }

    http.start({
      root: options.root
      }, function() {

      http.app.use(view.middle({view: _view}));
      callback();
    });
  });
}
un.method('start', start, {
  description: "starts un",
  properties: {
    options: {
      properties: {

      }
      //properties: {
      //  path: view.schema.properties.path,
      //  root: http.start.schema.properties.root
     // }
    },
    callback: {
      type: 'function'
    }
  }
});

un.dependencies = {};

un.license = "AGPLv3";
exports.un = un;
