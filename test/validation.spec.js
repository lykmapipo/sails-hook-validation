var expect = require('chai').expect;
var faker = require('faker');
var email = faker.internet.email();
var username = faker.internet.userName();

describe('Hook#validation', function() {

    it('should be loaded as installable hook', function(done) {
        expect(sails.hooks.validation).to.not.be.null;
        done();
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

                done();
            });
    });

    it('should not throw error if all validation conditions passed', function(done) {

        User
            .create({
                email: email,
                username: username
            }, function(error, user) {
                expect(error).to.be.null;
                expect(user).to.not.be.null;
                done();
            });
    });

    it('should throw error because we saved the same email again', function(done) {

        User
            .create({
                email: email,
                username: username
            }, function(error, user) {
                expect(error.Errors.email).to.exist;

                expect(error.Errors.email[0].message)
                    .to.equal(User.validationMessages.email.unique);
                done();
            });
    });
});
