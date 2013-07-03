var resource = require('resource'),
    errors = require('./errors');

module['exports'] = function (options, callback) {
  options = options || {};

  var self = this,
      logger = resource.use('logger'),
      layout = options.layout,

      // if not provided, default selector to #main
      selector = options.selector || '#main';

  //
  // if options.layout does not exist, traverse upwards and return the first found
  //
  if (typeof layout === 'undefined') {
    var traverse = function (_view) {

      // base case, no layout and no further parent found so return an error
      if(typeof _view.parent === "undefined") {
        return new errors.LayoutNotFoundError("no layout given and no layout found");
      }

      // found an acceptable layout, so return it
      else if (typeof _view.parent.layout !== "undefined" &&
        typeof _view.parent.layout.present === 'function') {
        return _view.parent.layout;

      // no layout, so recurse up the next parent
      } else {
        return traverse(_view.parent);
      }
    };

    // traverse to find layout, return if there is an error
    layout = traverse(this);
    if (layout instanceof errors.LayoutNotFoundError) {
      return callback(layout);
    }
  }

  //
  // call the given layout's presenter
  //
  layout.present(options.layoutOptions, function (err, result) {
    if (err) { return callback(err); }

    // load the rendered layout into the dom
    var $ = self.query(result);

    // TODO: warn when the selector is an ID and matches two different elements in the DOM,
    //       as this is likely unintentional and will probably cause breakage.
    // logger.warn('gdsjklagdsj');

    // place given html into selection
    $(selector).html(options.html);

    // return the rendered dom
    callback(null, $.html());
  });
};