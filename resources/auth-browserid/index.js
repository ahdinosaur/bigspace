var resource = require('resource'),
    logger = resource.logger,
    http = resource.use('http'),
    auth = resource.use('auth'),
    browserid = resource.define('auth-browserid');

browserid.schema.description = "for integrating BrowserID authentication";

browserid.persist('memory');

// .start() convention
function start(options, callback) {
  // setup .view convention
  var view = resource.use('view');
  view.create({ path: __dirname + '/view' }, function(err, _view) {
      if (err) { return callback(err); }
      browserid.view = _view;
      return callback(null);
  });
}
browserid.method('start', start, {
  description: "starts browserid"
});

// TODO make this property be the id
browserid.property('email', {
  description: 'email of browserid auth'
});

function strategy(callback) {
  BrowserIDStrategy = require('passport-browserid').Strategy;
  // Use the BrowserIDStrategy within Passport.
  //   Strategies in passport require a `validate` function, which accept
  //   credentials (in this case, a BrowserID verified email address), and invoke
  //   a callback with a user object.
  callback(null, new BrowserIDStrategy({
    audience: 'http://localhost:8888',
    passReqToCallback: true
  },
  function(req, email, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      if (!req.user) {
        logger.info('user is not logged in, authorizing with browserid');
        browserid.find({email: email}, function(err, browserids) {
          if (err) { throw err; }
          if (browserids.length === 0) {
            logger.info("email not found. creating new browserid");
            browserid.create({email: email}, function(err, _browserid) {
              if (err) { throw err; }
              logger.info("new browserid with id", _browserid.id, "created");
              logger.info("since new browserid, creating new user");
              auth.create({browserid: _browserid.id}, function(err, _auth) {
                if (err) { throw err; }
                logger.info("new user with id", _auth.id, "created");
                logger.info("new user object", JSON.stringify(_auth));
                done(null, _auth);
              });
            });
          } else if (browserids.length > 1) {
            throw "multiple browserids with same email!";
          } else {
            logger.info("email found, using associated browserid");
            logger.info("browserid objects found", JSON.stringify(browserids));
            // hack
            auth.all(function(err, _auths) {
              logger.info("all user objects", JSON.stringify(_auths));
              done(null, _auths[0]);
            });
            //auth.find({browserid: browserids[0].id}, function(err, _auth) {
            //  if (err) { throw err; }
            //  done(null, _auth);
            //});
          }
        });
      } else {
        logger.info('user is logged in, associating browserid with user');
        var user = req.user;
        browserid.find({email: email}, function(err, browserids) {
          if (err) { throw err; }
          if (browserids.length === 0) {
            logger.info("email not found. creating new browserid");
            browserid.create({email: email}, function(err, _browserid) {
              logger.info("new browserid with id", _browserid.id, "created");
              if (err) { throw err; }
              // associate new browserid with user
              user['browserid'] = _browserid.id;
              // preserve the login state by returning the existing user
              done(null, user);
            });
          } else if (browserids.length > 1) {
            throw "multiple browserids with same email!";
          } else {
            logger.info("email found. using existing browserid");
            // associate new browserid with user
            user['browserid'] = _browserid.id;
            // preserve the login state by returning the existing user
            done(null, user);
          }
        });
      }
    });
  }));
}
browserid.method('strategy', strategy, {
  description: 'return BrowserID strategy'
});

function routes(options, callback) {
  var authOrAuthz = function(req, res, next) {
    if (!req.isAuthenticated()) {
      auth.authenticate('browserid', {
        successRedirect: '/', 
        failureRedirect: '/'
      })(req, res, next);
    } else {
      auth.authorize('browserid')(req, res, next);
    }
  };
  http.app.post('/auth/browserid', authOrAuthz);
  callback(null);
}
browserid.method('routes', routes, {
  description: 'sets routes for browserid in app'
});

browserid.dependencies = {
  'passport-browserid': '*'
};
browserid.license = 'MIT';
exports['auth-browserid'] = browserid;
