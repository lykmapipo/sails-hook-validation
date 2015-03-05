var path = require('path');
var libPath = path.join(__dirname, 'lib');

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

    /**
     *
     * @descriptions process validation error and mixin user defined errors
     *               to produce friendly error messages.
     *               For this to work a model must defined `validationMessages`
     *               hash as static property.
     *
     * @param {Object} model valid sails model definition
     * @param {Object} validationErrors a valid sails validation error object.
     *
     * @returns {Object} an object with friendly validation error conversions.
     */
    function validateCustom(model, validationError) {
        //custom validation error storage
        var customValidationMessages = {};

        //if there is no custom 
        //validation messages specified
        //return empty `error.Errors`
        if (!model.validationMessages) {
            return customValidationMessages
        }

        //grab custom model defined
        //validation messages
        var messages = model.validationMessages;

        //grab field names
        //from the messages
        validationFields = Object.keys(messages);

        //iterate over all our custom
        //defined validation messages
        //and process thrown sails ValidationError
        //to model custom defined errors
        validationFields
            .forEach(function(validationField) {
                //is there any field
                //error(s) found in ValidationError
                if (validationError[validationField]) {
                    //grab field errors from the
                    //sails validation error hash
                    var fieldErrors = validationError[validationField];

                    //iterate through each field
                    //sails validation error and
                    //convert them
                    //to custom model defined errors
                    fieldErrors
                        .forEach(function(fieldError) {
                            //grab friedly error message of
                            //the defined rule which has an error
                            var customMessage =
                                messages[validationField][fieldError.rule];

                            if (customMessage) {
                                if (!(customValidationMessages[validationField] instanceof Array)) {
                                    customValidationMessages[validationField] = new Array();
                                }

                                //build friendly error message
                                var newMessage = {
                                    'rule': fieldError.rule,
                                    'message': messages[validationField][fieldError.rule]
                                };

                                customValidationMessages[validationField].push(newMessage);
                            }
                        });

                }
            });

        return customValidationMessages;
    };
};