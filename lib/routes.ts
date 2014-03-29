/// <reference path="../typings/node/node.d.ts" />

import api = require('./controllers/api');
import index = require('./controllers/index');
import users = require('./controllers/users');
import session = require('./controllers/session');
import ossdb = require('./controllers/ossdb');
import middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {
    // Server API Routes
    app.get('/api/awesomeThings', api.awesomeThings);

    app.post('/api/users', users.create);
    app.put('/api/users', users.changePassword);
    app.get('/api/users/me', users.me);
    app.get('/api/users/:id', users.show);

    app.post('/api/session', session.login);
    app.del('/api/session', session.logout);

    app.get('/api/oss', ossdb.get_oss);
    app.get('/api/oss/:id', ossdb.get_oss);
    app.get('/api/license', ossdb.get_license);
    app.get('/api/license/:id', ossdb.get_license);
    app.get('/api/package', ossdb.get_package);
    app.get('/api/package/:id', ossdb.get_package);
    app.get('/api/project', ossdb.get_project);
    app.get('/api/project/:id', ossdb.get_project);

    app.post('/api/SetProjectWithPackages', ossdb.SetProjectWithPackages);

    // All undefined api routes should return a 404
    app.get('/api/*', function(req, res) {
        res.send(404);
    });

    // All other routes to use Angular routing in app/scripts/app.js
    app.get('/partials/*', index.partials);
    app.get('/*', middleware.setUserCookie, index.index);
};
