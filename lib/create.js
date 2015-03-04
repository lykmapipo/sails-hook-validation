/**
 * @description path sails `create()` method to allow
 *              custom error message definitions
 * @param  {Object} model          a valid sails model
 * @param  {Function} validateCustom a function to transform sails `ValidationError`
 *                                   to custome `Errors`
 */
module.exports = function(model, validateCustom) {
    //remember sails defined create
    //method
    var sailsCreate = model.create;

    //prepare new create method
    function create(values, callback) {
        //call sails create
        sailsCreate
            .call(model, values, function(error, result) {
                //any create error
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
                    callback(null, result);
                }
            });
    };

    //bind our new create
    //to our models
    model.create = create;
}