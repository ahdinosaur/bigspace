var resource = require('resource'),
    view = resource.use('view'),
    layout = resource.define('layout');

layout.schema.description = "layout resource";

layout.persist('memory');

// .init() convention
function init(callback) {
  // setup .view convention
  var view = resource.use('view'),
      fs = require('fs');
  view.create({
    template: fs.readFileSync(__dirname + '/view/layout.html'),
    presenter: require('./view/layout')
  }, function(err, _view) {
    if (err) { return callback(err); }
    layout.view = _view;
    return callback(null, _view);
  });
}
layout.method('init', init, {
  description: "inits layout"
});

layout.dependencies = {
  "html-lang": "*",
  "Faker": "*"
};
exports.layout = layout;
