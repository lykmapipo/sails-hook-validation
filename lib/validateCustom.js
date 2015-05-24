'use strict';
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
module.exports = function(model, validationError) {
    //grab model validations definitions
    var validations = model._validator.validations;

    //custom validation error storage
    var customValidationMessages = {};

    // //if there is no custom 
    // //validation messages specified
    // //return empty `error.Errors`
    // if (!model.validationMessages) {
    //     return customValidationMessages;
    // }

    //grab custom model defined
    //validation messages
    var messages = model.validationMessages;

    //grab field names
    //from the messages
    var validationFields = Object.keys(validations);

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
                        //try
                        //built custom error message from
                        //from sails i18n

                        //grab phrase to use to find custom message
                        //from locales
                        var phrase = [
                            model.globalId.toLowerCase(),
                            validationField,
                            fieldError.rule
                        ].join('.');

                        //deduce locale
                        var locale =
                            sails.config.i18n.requestLocale ||
                            sails.config.i18n.defaultLocale;

                        //grab message based on locale
                        var customMessage = sails.__({
                            phrase: phrase,
                            locale: locale
                        });

                        //make sure custom error message from i18n exists
                        var messageExist =
                            customMessage !== phrase &&
                            sails.util._.isString(customMessage);

                        //else
                        //grab friedly error message of
                        //the defined rule which has an error
                        if (!messageExist && model.validationMessages) {
                            customMessage = messages[validationField][fieldError.rule];

                        }

                        if (customMessage) {
                            if (!(customValidationMessages[validationField] instanceof Array)) {
                                customValidationMessages[validationField] = [];
                            }

                            //build friendly error message
                            var newMessage = {
                                'rule': fieldError.rule,
                                'message': customMessage
                            };

                            customValidationMessages[validationField].push(newMessage);
                        }
                    });

            }
        });

    return customValidationMessages;
};