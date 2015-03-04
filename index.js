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
                    //bind custom validation logic
                    //and let sails to continue
                    bindValidation();
                    done();
                });
        }
    };

    function bindValidation() {
        _(sails.models)
            .forEach(function(model) {
                //bind path validate
                //on concrete models
                //and left derived model
                //build from associations
                if (model.globalId) {
                    //remember sails defined validation
                    //method
                    var sailsValidate = model.validate;

                    //prepare new validation methos
                    function validate(values, presentOnly, callback) {
                        //call sails validate
                        sailsValidate
                            .call(model, values, presentOnly, function(error) {
                                //any validation error
                                //found?
                                if (error) {
                                    //process sails ValidationError and
                                    //attach Errors key in error object
                                    //as a place to lookup for our 
                                    //custom errors messages
                                    if (error.ValidationError) {
                                        error.Errors =
                                            validateCustom(model, error.ValidationError);
                                    }

                                    callback(error);
                                } else {
                                    //no error
                                    //return
                                    callback(null);
                                }
                            });
                    };

                    //bind our new validate
                    //to our models
                    model.validate = validate;
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

        //grab custom model defined
        //validation messages
        var messages = model.validationMessages;

        if(!model.validationMessages) {
            return customValidationMessages
        }

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