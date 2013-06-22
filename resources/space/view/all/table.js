var resource = require('resource'),
    space = resource.use('space'),
    async = require('async'),
    html = require('html-lang'),
    logger = resource.logger;

module['exports'] = function(options, callback) {

  var $ = this.$;

  // TODO make this have more data, maybe count other resources too?
  // for each space, add the id and total creature-count to the table
  space.all(function(err, spaces) {
    if (err) { return callback(err); }

    async.each(spaces, function(_space, callback) {

      // get min of the space
      space.view.index.present({
        data: {
          id: _space.id,
          action: 'get',
          type: 'min'
        },
        layout: false
      },
      // append rendered space to table
      function(err, result) {
        if (err) { return callback(err); }

        var tmpl = '<tr><td class="spaceMin"></td><td class="numCreatures"></td></tr>';

        $('.table-body').append(html.render({
          'spaceMin': result,
          'numCreatures': _space.resources.creature.length
        }, tmpl));

        return callback(null);
      });
    },

    // async each callback
    function(err) {
      if (err) { return callback(err); }
      return callback(null, $.html());
    });
  });
};