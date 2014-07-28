/// <reference path="../typings/node/node.d.ts" />

import api = require('./controllers/api');
import index = require('./controllers/index');
//import users = require('./controllers/users');
import users = require('./controllers/users');
import session = require('./controllers/session');
import route_ossdb = require('./controllers/route_ossdb');
import ossdb = require('./models/ossdb')
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

    ossdb.modelOss.setRoute(app);
//    app.get('/api/oss', route_ossdb.get_oss);
//    app.post('/api/oss/new', route_ossdb.set_oss);
//    app.get('/api/oss/:id', route_ossdb.get_oss);
//    app.post('/api/oss/:id', route_ossdb.set_oss);

    ossdb.modelLicense.setRoute(app);
//    app.get('/api/license', route_ossdb.get_license);
//    app.post('/api/license/new', route_ossdb.set_license);
//    app.get('/api/license/:id', route_ossdb.get_license);
//    app.post('/api/license/:id', route_ossdb.set_license);

    ossdb.modelPackage.setRoute(app);
//    app.get('/api/package', route_ossdb.get_package);
//    app.post('/api/package/new', route_ossdb.set_package);
//    app.get('/api/package/:id', route_ossdb.get_package);
//    app.post('/api/package/:id', route_ossdb.set_package);

    ossdb.modelProject.setRoute(app);
//    app.get('/api/project', route_ossdb.get_project);
//    app.post('/api/project/new', route_ossdb.set_project);
//    app.get('/api/project/:id', route_ossdb.get_project);
//    app.post('/api/project/:id', route_ossdb.set_project);

    app.post('/api/SetProjectWithPackages', route_ossdb.SetProjectWithPackages);

    // All undefined api routes should return a 404
    app.get('/api/*', function(req, res) {
        res.send(404);
    });

    // All other routes to use Angular routing in app/scripts/app.js
    app.get('/partials/*', index.partials);
    app.get('/*', middleware.setUserCookie, index.index);
};
