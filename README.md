sails-hook-validation
=====================

[![Build Status](https://travis-ci.org/lykmapipo/sails-hook-validation.svg?branch=master)](https://travis-ci.org/lykmapipo/sails-hook-validation)

Custom validation error messages for sails model with i18n support. Its works with `callback`, `deferred` and `promise` style `model API` provided with sails.

*Note:* 
- *This requires Sails v0.11.0+.  If v0.11.0+ isn't published to NPM yet, you'll need to install it via Github.*
- *`sails-hook-validation` work by patch model static `validate()`, `create()`, `createEach()`, `findOrCreate()`, `findOrCreateEach()` and `update()`.*
- *To have custom error messages at model instance level consider using [sails-model-new](https://github.com/lykmapipo/sails-model-new).*
- *`sails-hook-validation` opt to use `error.Errors` and not to re-create or remove any properties of error object so as to remain with sails legacy options*

## Installation
```sh
$ npm install --save sails-hook-validation
```

## Usage

### Use without i18n
Add `validationMessages` static property in your sails model
```js
//this is example
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
        }
    },
    //model validation messages definitions
    validationMessages: { //hand for i18n & l10n
        email: {
            required: 'Email is required',
            email: 'Provide valid email address',
            unique: 'Email address is already taken'
        },
        username: {
            required: 'Username is required'
        }
    }
};
```

### Use with i18n
Add validation messages into `config/locale` files following `modelId.attribute.rule`. If model contains any `validationMessages` definition, they will take precedence over locale defined messages.

Example
```javascript
//define your model in api/model/Authentication.js
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
};
```

Then define validation messages per locale

```javascript
//in config/locale/en.json
{
    "authentication.email.required": "Email is required",
    "authentication.email.email": "Provide valid email address",
    "authentication.email.unique": "Email address is already taken",
    "authentication.username.required": "Username is required",
    "authentication.username.string": "Username is must be a valid string",
    "authentication.birthday.required": "Birthday is required",
    "authentication.birthday.date": "Birthday is not a valid date"
}

//in config/locale/sw.json
{
    "authentication.email.required": "Barua pepe yahitajika",
    "authentication.email.email": "Toa barua pepe iliyo halali",
    "authentication.email.unique": "Barua pepe tayari ishachukuliwa",
    "authentication.username.required": "Jina lahitajika",
    "authentication.username.string": "Jina lazima liwe ni mchanganyiko wa herufi",
    "authentication.birthday.required": "Siku ya kuzaliwa yahitajika",
    "authentication.birthday.date": "Siku ya kuzaliwa sio tarehe"
}
```

Now you can call model static 
- `create()`
- `createEach()`
- `findOrCreate()`
- `findOrCreateEach()`
- `update()` 
- and other static model method that invoke `Model.validate()`. 

If there is any *validations or database errors* `sails-hook-validation` will put your custom errors message in `error.Errors` of the error object returned by those methods in your `callback` or `promise catch`.

### create()
```js
//anywhere in your codes if
//you invoke
 User
    .create({}, function(error, user) {
        //you will expect the following
        //error to exist on error.Errors based on 
        //your custom validation messages

        expect(error.Errors.email).to.exist;

        expect(error.Errors.email[0].message)
            .to.equal(User.validationMessages.email.email);

        expect(error.Errors.email[1].message)
            .to.equal(User.validationMessages.email.required);


        expect(error.Errors.username).to.exist;
        expect(error.Errors.username[0].message)
            .to.equal(User.validationMessages.username.required);

        done();
    });
```

### createEach()
```js
User
    .createEach([{
        email: faker.internet.email(),
        username: faker.internet.userName()
    }, {
        email: 'otherExistingModelEmail',
        username: username
    }])
    .catch(function(error) {
        //you will expect the following
        //error to exist on error.Errors based on 
        //your custom validation messages

        expect(error.Errors.email).to.exist;

        expect(error.Errors.email[0].message)
            .to.equal(User.validationMessages.email.unique);

        done();
    });
```

### findOrCreate()
```js
User
    .findOrCreate({
        email: faker.internet.email()
    }, {
        email: 'otherExistingModelEmail',
        username: username
    })
    .exec(function(error, user) {
        //you will expect the following
        //error to exist on error.Errors based on 
        //your custom validation messages

        expect(error.Errors.email).to.exist;

        expect(error.Errors.email[0].message)
            .to.equal(User.validationMessages.email.unique);

        done();
    });
```

### findOrCreateEach()
```js
User
    .findOrCreateEach(
        [{
            email: faker.internet.email()
        }], [{
            email: 'otheExistingModelEmail',
            username: username
        }]
    )
    .catch(function(error) {
        //you will expect the following
        //error to exist on error.Errors based on 
        //your custom validation messages

        expect(error.Errors.email).to.exist;

        expect(error.Errors.email[0].message)
            .to.equal(User.validationMessages.email.unique);

        done();
    });
```

### update()
```js
User
    .update({
        email: 'modelEmail'
    }, {
        email: 'otherExistingModelEmail'
    }, function(error, user) {
        //you will expect the following
        //error to exist on error.Errors based on 
        //your custom validation messages

        expect(error.Errors.email).to.exist;

        expect(error.Errors.email[0].message)
            .to.equal(User.validationMessages.email.unique);

        done();
    });
```

## Testing

* Clone this repository

* Install all development dependencies

```sh
$ npm install
```
* Then run test

```sh
$ npm test
```

## Contribute

Fork this repo and push in your ideas. 
Do not forget to add a bit of test(s) of what value you adding.

## Licence

The MIT License (MIT)

Copyright (c) 2015 lykmapipo & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 