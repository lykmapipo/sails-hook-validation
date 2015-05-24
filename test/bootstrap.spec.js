'use strict';

//dependencies
var sails = require('sails');

/**
 * Lifting sails before all tests
 */
before(function(done) {
    sails
        .lift({ // configuration for testing purposes
            port: 7070,
            environment: 'test',
            log: {
                noShip: true
            },
            models: {
                migrate: 'drop'
            },
            hooks: {
                sockets: false,
                pubsub: false,
                grunt: false //we dont need grunt in test
            }
        }, function(error, sails) {
            if (error) {
                return done(error);
            } else {
                done(null, sails);
            }
        });
});


/**
 * Lowering sails after done testing
 */
after(function(done) {
    User
        .destroy()
        .then(function() {
            return Authentication.destroy();
        })
        .then(function( /*result*/ ) {
            sails.lower(done);
        })
        .catch(function(error) {
            done(error);
        });
});