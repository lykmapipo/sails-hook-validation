/**
 * sample model
 * @type {Object}
 */
module.exports = {
    attributes: {
        username: {
            required: true,
            type: 'string'
        },
        email: {
            required: true,
            type: 'email',
            unique: true
        },
        birthday: {
            required: true,
            type: 'date'
        },
        nickname: {
            type: 'string',
            minLength: 2
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