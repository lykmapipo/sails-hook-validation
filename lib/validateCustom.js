'use strict';

//dependencies

/**
 *
 * @descriptions process validation error and mixin user defined errors
 *               to produce friendly error messages.
 *
 *               For this to work a model may either define `validationMessages`
 *               hash as static property or adding validation messages into
 *               locale files.
 *
 * @param {Object} model valid sails model definition
 * @param {Object} invalidAttributes a valid sails validation error object.
 *
 * @returns {Object} an object with friendly validation error conversions.
 */
module.exports = function(model, invalidAttributes) {

    //grab model validations definitions
    var validations = model._validator.validations || {};

    //grab field names
    //from the messages
    var validationFields = Object.keys(validations);

    //custom validation error storage
    var customValidationMessages = {};


    //iterate over all model
    //defined validations
    //and process thrown sails invalidAttributes
    //to model custom defined errors
    validationFields
        .forEach(function(validationField) {

            //grab field errors from the
            //sails validation error hash
            //
            //if sails is connected to a database a user can declare a column name
            //the valid sails validation error not use the column name as property anymore
            var fieldErrors = invalidAttributes[validationField];

            //is there any field
            //error(s) found in invalidAttributes
            if (fieldErrors) {

                //iterate through each field of
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

                        var customMessage = phrase;
                        var locale;

                        if(sails.config.i18n){                            
                            //deduce locale from request else
                            //use default locale
                            locale =
                                sails.config.i18n.requestLocale ||
                                sails.config.i18n.defaultLocale;  
                            
                            if(locale){
                                //grab custom error
                                //message from config/locales/`locale`.json
                                customMessage = sails.__({
                                    phrase: phrase,
                                    locale: locale
                                });
                            }
                        }

                        //make sure custom error message from i18n exists
                        var i18nMessageExist =
                            customMessage !== phrase &&
                            sails.util._.isString(customMessage);

                        //else
                        //grab friedly error message of
                        //the defined rule which has an error
                        //from model defined
                        //validation messages
                        var messages = model.validationMessages;

                        if (!i18nMessageExist && messages) {
                            if (messages[validationField] && messages[validationField][fieldError.rule]) {
                                customMessage = sails.__({
                                    phrase: messages[validationField][fieldError.rule],
                                    locale: locale
                                });
                            } else {
                                //return default error message if user forgot to add custon validation message or not even specifying the field key in validationMessages
                                customMessage = fieldError.message;
                            }
                        }

                        if (customMessage) {
                            //collect custom error messages
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
