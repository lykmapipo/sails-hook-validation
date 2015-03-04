/**
 * @description path sails `createEach()` method to allow
 *              custom error message definitions
 * @param  {Object} model          a valid sails model
 * @param  {Function} validateCustom a function to transform sails `ValidationError`
 *                                   to custome `Errors`
 */
module.exports = function(model, validateCustom) {
    //remember sails defined createEach
    //method
    var sailsCreate = model.createEach;

    //prepare new createEach method
    function createEach(values, callback) {
        //call sails createEach
        sailsCreate
            .call(model, values, function(error, result) {
                //any createEach error
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

    //bind our new createEach
    //to our models
    model.createEach = createEach;
}