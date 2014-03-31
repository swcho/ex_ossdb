var user2 = require('../models/user2');
var thing2 = require('../models/thing2');
var ossdb = require('../models/ossdb');

ossdb.set_fixture(function () {
    console.log('oss fixture configured');

    thing2.Thing.create([
        {
            name: 'HTML5 Boilerplate',
            info: 'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.',
            awesomeness: 10
        }, {
            name: 'AngularJS',
            info: 'AngularJS is a toolset for building the framework most suited to your application development.',
            awesomeness: 10
        }, {
            name: 'Karma',
            info: 'Spectacular Test Runner for JavaScript.',
            awesomeness: 10
        }, {
            name: 'Express',
            info: 'Flexible and minimalist web application framework for node.js.',
            awesomeness: 10
        }, {
            name: 'MongoDB + Mongoose',
            info: 'An excellent document database. Combined with Mongoose to simplify adding validation and business logic.',
            awesomeness: 10
        }], function () {
        console.log('finished populating things');
    });

    user2.User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test'
    }, function () {
        console.log('finished populating users');
    });
});
