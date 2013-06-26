module['exports'] = function(options, callback) {

  var $ = this.$,
      resource = require('resource'),
      async = require('async'),
      html = require('html-lang'),
      url = require('url'),
      space = resource.use('space'),
      creatureID = options.data.creatureID,
      spaces = options.data.spaces;

  // view all in-spaces, with remove button
  async.eachSeries(spaces, function(spaceID, callback) {

    space.view.get.tab.present({
      data: {
        id: spaceID,
        creatureid: creatureID
      },
      request: options.request,
      response: options.response
    }, function(err, result) {
      if (err) { return callback(err); }
      $('ul').append(result);
      return callback(null);
    });

  // each callback
  }, function(err) {
    if (err) { return callback(err); }

    // add form to add new spaces
    space.view.create.min.present({ }, function(err, result) {
      if (err) { return callback(err); }
      $('ul').append('<li>' + result + '</li>');
      return callback(null, $.html());
    });
  });
};