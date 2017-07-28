'use strict';

//dependencies
var WLValidationError = require('./WLValidationError');

/**
 * @description path sails `validate()` method to allow
 *              custom error message definitions
 * @param  {Object} model          a valid sails model
 * @param  {Function} validateCustom a function to transform sails `invalidAttributes`
 *                                   to custome `Errors`
 */
module.exports = function(model, validateCustom) {
    //remember sails defined validation
    //method
    var sailsValidate = model.validate;

    //prepare new validation method
    function validate(values, presentOnly, callback) {
        if(typeof presentOnly === 'function'){
            callback = presentOnly;
            presentOnly = null;
        }
        //call sails validate
        sailsValidate
            .call(model, values, presentOnly, function(error) {
                //any validation error
                //found?
                if (error) {
                    //process sails invalidAttributes and
                    //attach Errors key in error object
                    //as a place to lookup for our
                    //custom errors messages
                    if (error.invalidAttributes) {
                        var customError =
                            validateCustom(model, error.invalidAttributes);

                        // will return and override with empty object
                        // when using associations
                        if (Object.keys(customError).length !== 0) {
                            error.Errors = customError;
                        }
                    }

                    callback(WLValidationError.patch(error));
                } else {
                    //no error
                    //return
                    callback(null);
                }
            });
    }

    //bind our new validate
    //to our models
    model.validate = validate;
};
