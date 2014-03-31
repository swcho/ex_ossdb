var api = require('./controllers/api');
var index = require('./controllers/index');

var users2 = require('./controllers/users2');
var session = require('./controllers/session');
var ossdb = require('./controllers/ossdb');
var middleware = require('./middleware');

module.exports = function (app) {
    app.get('/api/awesomeThings', api.awesomeThings);

    app.post('/api/users', users2.create);
    app.put('/api/users', users2.changePassword);
    app.get('/api/users/me', users2.me);
    app.get('/api/users/:id', users2.show);

    app.post('/api/session', session.login);
    app.del('/api/session', session.logout);

    app.get('/api/oss', ossdb.get_oss);
    app.post('/api/oss/new', ossdb.set_oss);
    app.get('/api/oss/:id', ossdb.get_oss);
    app.post('/api/oss/:id', ossdb.set_oss);

    app.get('/api/license', ossdb.get_license);
    app.post('/api/license/new', ossdb.set_license);
    app.get('/api/license/:id', ossdb.get_license);
    app.post('/api/license/:id', ossdb.set_license);

    app.get('/api/package', ossdb.get_package);
    app.post('/api/package/new', ossdb.set_package);
    app.get('/api/package/:id', ossdb.get_package);
    app.post('/api/package/:id', ossdb.set_package);

    app.get('/api/project', ossdb.get_project);
    app.post('/api/project/new', ossdb.set_project);
    app.get('/api/project/:id', ossdb.get_project);
    app.post('/api/project/:id', ossdb.set_project);

    app.post('/api/SetProjectWithPackages', ossdb.SetProjectWithPackages);

    app.get('/api/*', function (req, res) {
        res.send(404);
    });

    app.get('/partials/*', index.partials);
    app.get('/*', middleware.setUserCookie, index.index);
};
