module['exports'] = function(options, callback) {

  var $ = this.$,
      resource = require('resource'),
      async = require('async'),
      html = require('html-lang'),
      url = require('url'),
      space = resource.use('space'),
      spaceID = options.data.id,
      creatureID = options.data.creatureid;

  // parse url for current resource being viewed
  var parsedUrl = url.parse(options.request.url, true),
      currentResource = parsedUrl.pathname.split('/')[1];

  // get the current space id
  var currentSpaceID = null;
  if (currentResource === 'space') {
    currentSpaceID = parsedUrl.query.id;
  }

  // if this space is the currently active space, make its tab an active tab
  if (currentSpaceID === spaceID) {
    $('li').addClass('active');
  }

  async.waterfall([

    // first get this space's min view
    function (callback) {
      space.view.get.min.present({
        data: {
          id: spaceID
        },
        request: options.request,
        response: options.response
      }, callback);
    },

    // then render this space as a tab with remove button
    function (getMin, callback) {
      space.view.remove.min.present({
        data: {
          spaceID: spaceID,
          resourceID: creatureID,
          resource: 'creature'
        },
        request: options.request,
        response: options.response
      }, function(err, removeMin) {
        if (err) { return callback(err); }

        // append rendered getMin as tab
        $('li').append(getMin);
        // dissect getMin to get href
        var getHref = $.load(getMin)('a').attr('href');
        // remove href from tab
        $('a').attr('href', '#');
        $('a').attr('id', 'tab-get' + spaceID);

        // dissect removeMin to get href
        var removeHref = $.load(removeMin)('a').attr('href');

        // append modified removeMin inside tab
        $('a').append(
          '<button class="btn btn-link" style="margin-left: 8px; padding: 0 4px;">x</button>');
        $('button').attr('id', 'tab-remove' + spaceID);

        // add event handlers clicking on get and remove parts of tab
        // TODO make event handlers for all tabs, not individual tab
        // TODO deal with client-side js better
        /*jshint multistr: true */
        $.root().append(
          '<script> \
            $(document).ready(function() { \
              $("#tab-get'+spaceID+'").click(function(e){ \
                window.location.href = "' + getHref + '"; \
              }); \
              $("#tab-remove'+spaceID+'").click(function(e){ \
                window.location.href = "' + removeHref + '"; \
                /* now this part stops the click from propagating */ \
                if (!e) var e = window.event; \
                e.cancelBubble = true; \
                if (e.stopPropagation) e.stopPropagation(); \
              }); \
            }); \
          </script>');

        return callback(null, $.html());
      });

    // waterfall callback
    }], callback);
};