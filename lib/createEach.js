//import sails waterline Deferred
var Deferred = require('sails/node_modules/waterline/lib/waterline/query/deferred');

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
    //See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/aggregate.js#L24
    var sailsCreate = model.createEach;

    //prepare new createEach method
    function createEach(values, callback) {
        // handle Deferred where 
        // it passes criteria first
        // See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/aggregate.js#L27
        if (arguments.length === 3) {
            var args = Array.prototype.slice.call(arguments);
            callback = args.pop();
            values = args.pop();
        }

        // return Deferred
        // if no callback passed
        // See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/aggregate.js#L35
        if (typeof callback !== 'function') {
            //this refer to the
            //model context
            return new Deferred(this, this.createEach, {}, values);
        }

        //otherwise
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