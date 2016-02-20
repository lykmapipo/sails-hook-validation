'use strict';

//dependencies
//import sails waterline Deferred
var Deferred = require('waterline/lib/waterline/query/deferred');
var WLValidationError = require('./WLValidationError');

/**
 * @description path sails `findOrCreate()` method to allow
 *              custom error message definitions
 * @param  {Object} model          a valid sails model
 * @param  {Function} validateCustom a function to transform sails `invalidAttributes`
 *                                   to custome `Errors`
 */
module.exports = function(model, validateCustom) {
    //remember sails defined findOrCreate
    //method
    //See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/composite.js#L24
    var sailsFindOrCreate = model.findOrCreate;

    //prepare new findOrCreate method
    function findOrCreate(criteria, values, callback) {
        // return Deferred
        // if no callback passed
        // See https://github.com/balderdashy/waterline/blob/master/lib/waterline/query/composite.js#L43
        if (typeof callback !== 'function') {
            //this refer to the
            //model context
            return new Deferred(model, model.findOrCreate, criteria, values);
        }

        //otherwise
        //call sails findOrCreate
        sailsFindOrCreate
            .call(model, criteria, values, function(error, result) {
                //any findOrCreate error
                //found?
                if (error) {
                    //process sails invalidAttributes and
                    //attach Errors key in error object
                    //as a place to lookup for our
                    //custom errors messages
                    if (error.invalidAttributes) {
                        var customError =
                            validateCustom(model, error.invalidAttributes);

                        // will return and override with empty object when using associations
                        if (Object.keys(customError).length !== 0) {
                            error.Errors = customError;
                        }
                    }

                    callback(WLValidationError.patch(error));
                } else {
                    //no error
                    //return
                    callback(null, result);
                }
            });
    }

    //bind our new findOrCreate
    //to our models
    model.findOrCreate = findOrCreate;
};
