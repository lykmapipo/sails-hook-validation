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
        sails
            .util
            ._(sails.models)
            .forEach(function(model) {
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

    function pathHTTPMiddlewares() {
        //grab request locale from
        //request.getLocale and set it to
        //sails.config.i18n.requestLocale
        function hookValidations(request, response, next) {
            sails.config.i18n.requestLocale = request.getLocale();
            console.log('custom validations');
            next();
        }

        //remember current sails http config object
        var previousMiddlewares = sails.config.http.middleware;

        //remember current sails http middlewares order
        var previousOrder = previousMiddlewares.order;

        //grab the current index of the sails router middleware
        //from sails middleware order
        var indexOfRouter = previousOrder.indexOf('bodyParser') + 1;

        //patching sails middleware and
        //adding validation middleware
        previousMiddlewares = sails.util._.extend(previousMiddlewares, {
            hookValidations: hookValidations
        });

        //patching sails middleware order and add
        //validation middleware before router in the middleware order
        previousOrder.splice(indexOfRouter, 0, 'hookValidations');
        previousMiddlewares.order = previousOrder;

        //reconfigure sails http config object
        sails.config.http.middleware = previousMiddlewares;
    }

    //export hook definitions
    return {
        initialize: function(done) {
            var eventsToWaitFor = [];
            //wait for orm
            //and pub sub
            //to be loaded
            //for validation to be
            //able to apply its patch
            if (sails.hooks.orm) {
                eventsToWaitFor.push('hook:orm:loaded');
            }
            if (sails.hooks.pubsub) {
                eventsToWaitFor.push('hook:pubsub:loaded');
            }

            sails
                .after(eventsToWaitFor, function() {
                    //patch http to add request locale
                    //extraction middleware
                    pathHTTPMiddlewares();

                    //bind custom errors logic
                    //and let sails to continue
                    patch();

                    done();
                });
        }
    };

};