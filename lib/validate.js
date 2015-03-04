/**
 * @description path sails `validate()` method to allow
 *              custom error message definitions
 * @param  {Object} model          a valid sails model
 * @param  {Function} validateCustom a function to transform sails `ValidationError`
 *                                   to custome `Errors`
 */
module.exports = function(model, validateCustom) {
    //remember sails defined validation
    //method
    var sailsValidate = model.validate;

    //prepare new validation method
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