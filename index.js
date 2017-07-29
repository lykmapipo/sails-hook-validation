'use strict';

//dependencies
var path = require('path');
var libPath = path.join(__dirname, 'lib');

var validateCustom = require(path.join(libPath, 'validateCustom'));

//patches
var create = require(path.join(libPath, 'create'));
var createEach = require(path.join(libPath, 'createEach'));
var findOrCreate = require(path.join(libPath, 'findOrCreate'));
var findOrCreateEach = require(path.join(libPath, 'findOrCreateEach'));
var update = require(path.join(libPath, 'update'));
var validate = require(path.join(libPath, 'validate'));

//patch WLValidationError
require(path.join(libPath, 'WLValidationError'));


/**
 * @description allow model to define its custom validation error messages.
 *              It hooks into model static methods that call `validate()`,
 *              grab the `ValidationError` from the resulted error object,
 *              process it and attach `Errors` as custom errors message into the
 *              error object.
 * @param  {Object} sails a sails application instance
 */
module.exports = function(sails) {
    //patch sails model
    //to add custom errors message
    //logic
    function patch() {
        (_ || sails.util._)
        .forEach(sails.models, function(model) {
            //bind path validate
            //on concrete models
            //and left derived model
            //build from associations
            if (model.globalId) {

                //patch sails `create()` method
                create(model, validateCustom);

                //patch sails `createEach()` method
                createEach(model, validateCustom);

                //patch sails `findOrCreate()` method
                findOrCreate(model, validateCustom);

                //patch sails `findOrCreateEach()` method
                findOrCreateEach(model, validateCustom);

                //patch sails `update()` method
                update(model, validateCustom);

                //patch sails `validate()` method
                validate(model, validateCustom);

            }
        });
    }

    //export hook definition
    return {
        //intercent all request and current grab request locale
        routes: {
            before: {
                'all /*': function grabLocale(request, response, next) {
                    //configure i18n current request locale
                    if(request && typeof request.getLocale === 'function'){
                        sails.config.i18n.requestLocale = request.getLocale();
                    }

                    //continue
                    next();
                }
            }
        },

        initialize: function(done) {
            var eventsToWaitFor = [];

            //wait for orm hook
            //to be loaded
            if (sails.hooks.orm) {
                eventsToWaitFor.push('hook:orm:loaded');
            }

            //wait for pub sub hook
            //to be loaded
            if (sails.hooks.pubsub) {
                eventsToWaitFor.push('hook:pubsub:loaded');
            }

            //apply validation hook
            sails
                .after(eventsToWaitFor, function() {
                    //bind custom errors logic
                    //and let sails to continue
                    patch();

                    done();
                });
        }
    };

};
