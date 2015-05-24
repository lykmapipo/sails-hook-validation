'use strict';

//dependencies
var expect = require('chai').expect;
var faker = require('faker');

describe('Hook#validation#update database errors', function() {
    var _email = faker.internet.email();
    var __email = faker.internet.email();

    before(function(done) {
        User
            .createEach([{
                email: _email,
                username: faker.internet.userName(),
                birthday: faker.date.past()
            }, {
                email: __email,
                username: faker.internet.userName(),
                birthday: faker.date.past()
            }])
            .exec(done);
    });

    it('should throw unique error message using node callback style', function(done) {

        User
            .update({
                email: __email
            }, {
                email: _email
            }, function(error, user) {
                expect(error.Errors.email).to.exist;

                expect(error.Errors.email[0].message)
                    .to.equal(User.validationMessages.email.unique);

                done(null, user);
            });
    });

    it('should throw unique error message using deferred style', function(done) {

        User
            .update({
                email: __email
            }, {
                email: _email
            })
            .exec(function(error, user) {
                expect(error.Errors.email).to.exist;

                expect(error.Errors.email[0].message)
                    .to.equal(User.validationMessages.email.unique);

                done(null, user);
            });
    });

    it('should throw unique error message using promise style', function(done) {

        User
            .update({
                email: __email
            }, {
                email: _email
            })
            .catch(function(error) {
                expect(error.Errors.email).to.exist;

                expect(error.Errors.email[0].message)
                    .to.equal(User.validationMessages.email.unique);

                done();
            });
    });

});