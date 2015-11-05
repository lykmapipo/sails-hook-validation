'use strict';

//patch WLValidationError to allow for custom error messages
var WLValidationError = require('sails/node_modules/waterline/lib/waterline/error/WLValidationError');

//reference WLValidationError.toJSON
//and WLValidationError.toJSON
var toJSON = WLValidationError.prototype.toJSON;

//patch WLValidationError to add `Errors`
WLValidationError.prototype.toJSON =
    WLValidationError.prototype.toPOJO = function() {
        var errorKey = 'Errors';

        if (sails && sails.config && sails.config.errors &&
            typeof sails.config.errors.errorKey === 'string') {
            errorKey = sails.config.errors.errorKey;
        }

        var asJSON = toJSON.call(this);
        asJSON[errorKey] = this.Errors;
        return asJSON;
    };
