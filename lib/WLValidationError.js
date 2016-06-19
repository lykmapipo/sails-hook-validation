'use strict';

var WLError = require('waterline/lib/waterline/error/WLError');

module.exports.patch = function(error) {
    var toJSON = error.toJSON;

    error = new WLError(error);

    error.toJSON =
    error.toPOJO = function() {

        var errorKey = 'Errors';

        if (sails && sails.config && sails.config.errors &&
            typeof sails.config.errors.errorKey === 'string') {
            errorKey = sails.config.errors.errorKey;
        }

        if (!toJSON) {
            toJSON = WLError.prototype.toJSON;
        }

        var asJSON = toJSON.call(this);
        asJSON[errorKey] = this.Errors;
        return asJSON;
    };

    return error;
};
