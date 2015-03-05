//import sails waterline Deferred
var Deferred = require('sails/node_modules/waterline/lib/waterline/query/deferred');

/**
 * @description path sails `update()` method to allow
 *              custom error message definitions
 * @param  {Object} model          a valid sails model
 * @param  {Function} validateCustom a function to transform sails `ValidationError`
 *                                   to custome `Errors`
 */
module.exports = function(model, validateCustom) {
    //remember sails defined update
    //method
    //See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/dql/update.js
    var sailsUpdate = model.update;

    //prepare new update method
    //which wrap sailsUpdate
    //with custom error message checking
    function update(criterias, values, callback) {

        // return Deferred
        // if no callback passed
        // See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/dql/update.js#L34
        if (typeof callback !== 'function') {
            //this refer to the
            //model context
            return new Deferred(this, this.update, criterias, values);
        }

        //otherwise
        //call sails update
        sailsUpdate
            .call(model, criterias, values, function(error, result) {
                //any update error
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

    //bind our new update
    //to our models
    model.update = update;
}