'use strict';

//dependencies
var expect = require('chai').expect;
var faker = require('faker');
var email = faker.internet.email();
var username = faker.internet.userName();

describe('Hook#validation', function() {

    it('should be loaded as installable hook', function(done) {
        expect(sails.hooks.validation).to.not.be.null;
        done();
    });

    it('should be able to serialize custom errors when toJSON is invoked', function(done) {
        User
            .create({}, function(error, user) {

                var asJSON = error.toJSON();

                expect(asJSON.Errors).to.exist;

                done(null, user);
            });
    });


    it('should be able to serialize custom errors when toPOJO is invoked', function(done) {
        User
            .create({}, function(error, user) {

                var asPOJO = error.toPOJO();

                expect(asPOJO.Errors).to.exist;

                done(null, user);
            });
    });

    it('should throw custom errors', function(done) {
        User
            .create({}, function(error, user) {

                expect(error.Errors.email).to.exist;

                expect(error.Errors.email[0].message)
                    .to.equal(User.validationMessages.email.email);

                expect(error.Errors.email[1].message)
                    .to.equal(User.validationMessages.email.required);


                expect(error.Errors.username).to.exist;
                expect(error.Errors.username[0].message)
                    .to.equal(User.validationMessages.username.required);

                expect(error.Errors.birthday).to.exist;

                expect(error.Errors.birthday[0].message)
                    .to.equal(User.validationMessages.birthday.date);
                expect(error.Errors.birthday[1].message)
                    .to.equal(User.validationMessages.birthday.required);

                done(null, user);
            });
    });

    it('should not throw error if all validation conditions passed', function(done) {

        User
            .create({
                email: email,
                username: username,
                birthday: faker.date.past()
            }, function(error, user) {
                expect(error).to.be.null;
                expect(user).to.not.be.null;
                done();
            });
    });

});