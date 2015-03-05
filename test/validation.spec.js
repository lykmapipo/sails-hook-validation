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

    describe('Hook#create database errors', function() {

        it('should throw unique error message using node callback style', function(done) {

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

        it('should throw unique error message using deferred style', function(done) {

            User
                .create({
                    email: email,
                    username: username
                })
                .exec(function(error, user) {
                    expect(error.Errors.email).to.exist;

                    expect(error.Errors.email[0].message)
                        .to.equal(User.validationMessages.email.unique);

                    done();
                });
        });


        it('should throw unique error message using promise style', function(done) {

            User
                .create({
                    email: email,
                    username: username
                })
                .catch(function(error) {
                    expect(error.Errors.email).to.exist;

                    expect(error.Errors.email[0].message)
                        .to.equal(User.validationMessages.email.unique);

                    done();
                });
        });

    });

    describe('Hook#createEach database errors', function() {

        it('should throw unique error message using node callback style', function(done) {

            User
                .createEach([{
                    email: faker.internet.email(),
                    username: faker.internet.userName()
                }, {
                    email: email,
                    username: username
                }], function(error, users) {
                    expect(error.Errors.email).to.exist;

                    expect(error.Errors.email[0].message)
                        .to.equal(User.validationMessages.email.unique);

                    done();
                });
        });

        it('should throw unique error message using deferred style', function(done) {

            User
                .createEach([{
                    email: faker.internet.email(),
                    username: faker.internet.userName()
                }, {
                    email: email,
                    username: username
                }])
                .exec(function(error, users) {
                    expect(error.Errors.email).to.exist;

                    expect(error.Errors.email[0].message)
                        .to.equal(User.validationMessages.email.unique);

                    done();
                });
        });

        it('should throw unique error message using promise style', function(done) {

            User
                .createEach([{
                    email: faker.internet.email(),
                    username: faker.internet.userName()
                }, {
                    email: email,
                    username: username
                }])
                .catch(function(error) {
                    expect(error.Errors.email).to.exist;

                    expect(error.Errors.email[0].message)
                        .to.equal(User.validationMessages.email.unique);

                    done();
                });
        });

    });

    describe('Hook#findOrCreate database errors', function() {

        it('should throw unique error message using node callback style', function(done) {

            User
                .findOrCreate({
                    email: faker.internet.email()
                }, {
                    email: email,
                    username: username
                }, function(error, user) {
                    expect(error.Errors.email).to.exist;

                    expect(error.Errors.email[0].message)
                        .to.equal(User.validationMessages.email.unique);

                    done();
                });
        });


        it('should throw unique error message using deferred style', function(done) {

            User
                .findOrCreate({
                    email: faker.internet.email()
                }, {
                    email: email,
                    username: username
                })
                .exec(function(error, user) {
                    expect(error.Errors.email).to.exist;

                    expect(error.Errors.email[0].message)
                        .to.equal(User.validationMessages.email.unique);

                    done();
                });
        });

        it('should throw unique error message using promise style', function(done) {

            User
                .findOrCreate({
                    email: faker.internet.email()
                }, {
                    email: email,
                    username: username
                })
                .catch(function(error) {
                    expect(error.Errors.email).to.exist;

                    expect(error.Errors.email[0].message)
                        .to.equal(User.validationMessages.email.unique);

                    done();
                });
        });


    });

    // describe('Hook#validation#findOrCreateEach()#database error', function() {

    //     it('should not throw unique error message using node callback style', function(done) {
    //         User
    //             .findOrCreateEach(
    //                 ['email'], [{
    //                     email: email,
    //                     username: username
    //                 }],
    //                 function(error, users) {
    //                     console.log(users);

    //                     expect(users).to.not.be.null;

    //                     done();
    //                 });
    //     });

    //     it('should not throw unique error message using deferred style', function(done) {
    //         User
    //             .findOrCreateEach([], [{
    //                 email: email,
    //                 username: username
    //             }])
    //             .exec(function(error, users) {
    //                 console.log(users);
    //                 console.log(error);

    //                 expect(users).to.not.be.null;

    //                 done();
    //             });
    //     });

    // });

});