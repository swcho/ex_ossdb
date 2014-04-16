var api = require('./controllers/api');
var index = require('./controllers/index');

var users2 = require('./controllers/users2');
var session = require('./controllers/session');
var route_ossdb = require('./controllers/route_ossdb');
var ossdb = require('./models/ossdb');
var middleware = require('./middleware');

module.exports = function (app) {
    app.get('/api/awesomeThings', api.awesomeThings);

    app.post('/api/users', users2.create);
    app.put('/api/users', users2.changePassword);
    app.get('/api/users/me', users2.me);
    app.get('/api/users/:id', users2.show);

    app.post('/api/session', session.login);
    app.del('/api/session', session.logout);

    ossdb.modelOss.setRoute(app);

    app.get('/api/license', route_ossdb.get_license);
    app.post('/api/license/new', route_ossdb.set_license);
    app.get('/api/license/:id', route_ossdb.get_license);
    app.post('/api/license/:id', route_ossdb.set_license);

    app.get('/api/package', route_ossdb.get_package);
    app.post('/api/package/new', route_ossdb.set_package);
    app.get('/api/package/:id', route_ossdb.get_package);
    app.post('/api/package/:id', route_ossdb.set_package);

    app.get('/api/project', route_ossdb.get_project);
    app.post('/api/project/new', route_ossdb.set_project);
    app.get('/api/project/:id', route_ossdb.get_project);
    app.post('/api/project/:id', route_ossdb.set_project);

    app.post('/api/SetProjectWithPackages', route_ossdb.SetProjectWithPackages);

    app.get('/api/*', function (req, res) {
        res.send(404);
    });

    app.get('/partials/*', index.partials);
    app.get('/*', middleware.setUserCookie, index.index);
};
