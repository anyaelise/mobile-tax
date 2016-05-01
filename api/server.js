'use strict'
const Datastore = require('nedb'),
    db = new Datastore();
const Hapi = require('hapi');
const server = new Hapi.Server();
const jwt = require('jsonwebtoken');
const port = 3333;
const secret = 'ilovescotchyscotch';

server.connection({
    port: port,
    routes: {

        cors: true
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
        reply('Hello! The API is at http://localhost:' + port + '/api')
    }
});

server.route({
    method: 'GET',
    path: '/setup',
    config: {
        cors: true,
    },
    handler: function(request, reply) {
        var nick = { 
            name: 'Anya Marshall', 
            password: 'password',
            admin: true 
        };

        db.insert(nick, function(err, newDoc) {
            if (err) throw err;

            console.log('User saved successfully');
            reply({ success: true });
        });            
    }
});

server.route({
    method: 'GET',
    path: '/api',
    handler: function(request, reply) {
        reply({ message: 'Welcome to the coolest API on earth!' });
    }
});

server.route({
    method: 'GET',
    path: '/api/users',
    handler: function(request, reply) {
        db.find({}, function(err, users) {
            reply(users);
        });
    }
});

server.route({
    method: 'POST',
    path: '/api/authenticate',
    handler: function(request, reply) {
        // check for user
        db.findOne({ name: request.payload.name }, function (err, user) {
            if (err) throw err;
            if (!user) {
                reply({ success: false, message: 'Authentication failed. User not found.' });
            } else {
                // check if password matches
                if (user.password != request.payload.password) {
                    reply({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {
                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign(user, secret, {
                      expiresIn: 3600 // expiration time in seconds (1 hour)
                    });

                    // return the information including token as JSON
                    reply({
                      success: true,
                      message: 'Enjoy your token!',
                      token: token
                    });
                }
            }
        });
    }
});


server.start((err) => {
    if (err) {
        throw err;
    }

    console.log('API running listening on', server.info.uri);

    var nick = { 
        name: 'Anya Marshall', 
        password: 'password',
        admin: true 
    };

    db.insert(nick, function(err, newDoc) {
        if (err) throw err;

        console.log('Test user saved successfully');
    });
});


