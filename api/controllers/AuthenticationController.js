'use strict';

/**
 * @description Authentication Controller
 * @type {Object}
 */
module.exports = {
    create: function(request, response) {
        Authentication
            .create(request.body)
            .exec(function(error, authentication) {

                if (error) {
                    response.status(400);
                    response.json(error.Errors);
                } else {
                    response.status(200);
                    resposne.json(authentication);
                }
            });
    }
}