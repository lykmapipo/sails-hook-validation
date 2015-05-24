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
    },
    
    //validation messages definitions
    validationMessages: { //hand for i18n & l10n
        email: {
            required: 'Email address is required',
            email: 'Provide valid email address',
            unique: 'Email address is already taken'
        },
        username: {
            required: 'Username is required'
        },
        birthday: {
            required: 'Your birthday is required',
            date: 'Birthday is not a valid date'
        }
    }

};