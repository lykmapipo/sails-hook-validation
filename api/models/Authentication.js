/**
 * sample model
 * @type {Object}
 */
module.exports = {
    attributes: {
        username: {
            type: 'string',
            required: true
        },
        email: {
            type: 'email',
            required: true,
            unique: true
        },
        birthday: {
            type: 'date',
            required: true
        }
    }

    //validation messages definitions
    //are taken from config/locales
    //based on request locale
    //otherwise using default locale

};