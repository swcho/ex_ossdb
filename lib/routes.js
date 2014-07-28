var api = require('./controllers/api');
var index = require('./controllers/index');

var users = require('./controllers/users');
var session = require('./controllers/session');
var route_ossdb = require('./controllers/route_ossdb');
var ossdb = require('./models/ossdb');
var middleware = require('./middleware');

module.exports = function (app) {
    app.get('/api/awesomeThings', api.awesomeThings);

    app.post('/api/users', users.create);
    app.put('/api/users', users.changePassword);
    app.get('/api/users/me', users.me);
    app.get('/api/users/:id', users.show);

    app.post('/api/session', session.login);
    app.del('/api/session', session.logout);

    ossdb.modelOss.setRoute(app);

    ossdb.modelLicense.setRoute(app);

    ossdb.modelPackage.setRoute(app);

    ossdb.modelProject.setRoute(app);

    app.post('/api/SetProjectWithPackages', route_ossdb.SetProjectWithPackages);

    app.get('/api/*', function (req, res) {
        res.send(404);
    });

    app.get('/partials/*', index.partials);
    app.get('/*', middleware.setUserCookie, index.index);
};
