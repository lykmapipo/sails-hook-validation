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
}