//import sails waterline Deferred
var Deferred = require('sails/node_modules/waterline/lib/waterline/query/deferred');

/**
 * @description path sails `findOrCreateEach()` method to allow
 *              custom error message definitions
 * @param  {Object} model          a valid sails model
 * @param  {Function} validateCustom a function to transform sails `ValidationError`
 *                                   to custome `Errors`
 */
module.exports = function(model, validateCustom) {
    //remember sails defined findOrCreateEach
    //method
    //See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/aggregate.js#L84
    var sailsFindOrCreateEach = model.findOrCreateEach;

    //prepare new findOrCreateEach method
    function findOrCreateEach(criterias, values, callback) {
        // return Deferred
        // if no callback passed
        // See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/aggregate.js#L96
        if (typeof callback !== 'function') {
            //this refer to the
            //model context
            return new Deferred(this, this.findOrCreateEach, criterias, values);
        }

        //otherwise
        //call sails findOrCreateEach
        sailsFindOrCreateEach
            .call(model, criterias, values, function(error, result) {
                //any findOrCreateEach error
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
                    //hand over error
                    //to user callback
                    callback(error);
                } else {
                    //no error
                    //
                    //hand over result
                    //to user callback
                    callback(null, result);
                }
            });
    };

    //bind our new findOrCreateEach
    //to our models
    model.findOrCreateEach = findOrCreateEach;
}