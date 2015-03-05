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
                    //bind custom errors logic
                    //and let sails to continue
                    patch();

                    done();
                });
        }
    };

    //patch sails model
    //to add custom errors message
    //logic
    function patch() {
        _(sails.models)
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
    };


};