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

                expect(error.Errors.birthday).to.exist;

                expect(error.Errors.birthday[0].message)
                    .to.equal(User.validationMessages.birthday.date);
                expect(error.Errors.birthday[1].message)
                    .to.equal(User.validationMessages.birthday.required);

                done();
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

    describe('Hook#create database errors', function() {

        it('should throw unique error message using node callback style', function(done) {

            User
                .create({
                    email: email,
                    username: username,
                    birthday: faker.date.past()
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
                    username: username,
                    birthday: faker.date.past()
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
                    username: username,
                    birthday: faker.date.past()
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
                    username: faker.internet.userName(),
                    birthday: faker.date.past()
                }, {
                    email: email,
                    username: username,
                    birthday: faker.date.past()
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
                    username: faker.internet.userName(),
                    birthday: faker.date.past()
                }, {
                    email: email,
                    username: username,
                    birthday: faker.date.past()
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
                    username: faker.internet.userName(),
                    birthday: faker.date.past()
                }, {
                    email: email,
                    username: username,
                    birthday: faker.date.past()
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
                    username: username,
                    birthday: faker.date.past()
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
                    username: username,
                    birthday: faker.date.past()
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
                    username: username,
                    birthday: faker.date.past()
                })
                .catch(function(error) {
                    expect(error.Errors.email).to.exist;

                    expect(error.Errors.email[0].message)
                        .to.equal(User.validationMessages.email.unique);

                    done();
                });
        });


    });

    describe('Hook#findOrCreateEach database errors', function() {

        it('should throw unique error message using node callback style', function(done) {
            User
                .findOrCreateEach(
                    [{
                        email: faker.internet.email()
                    }], [{
                        email: email,
                        username: username,
                        birthday: faker.date.past()
                    }],
                    function(error, users) {
                        expect(error.Errors.email).to.exist;

                        expect(error.Errors.email[0].message)
                            .to.equal(User.validationMessages.email.unique);

                        done();
                    });
        });

        it('should throw unique error message using deferred style', function(done) {
            User
                .findOrCreateEach(
                    [{
                        email: faker.internet.email()
                    }], [{
                        email: email,
                        username: username,
                        birthday: faker.date.past()
                    }]
                )
                .exec(function(error, users) {
                    expect(error.Errors.email).to.exist;

                    expect(error.Errors.email[0].message)
                        .to.equal(User.validationMessages.email.unique);

                    done();
                });
        });

        it('should throw unique error message using promise style', function(done) {
            User
                .findOrCreateEach(
                    [{
                        email: faker.internet.email()
                    }], [{
                        email: email,
                        username: username,
                        birthday: faker.date.past()
                    }]
                )
                .catch(function(error) {
                    expect(error.Errors.email).to.exist;

                    expect(error.Errors.email[0].message)
                        .to.equal(User.validationMessages.email.unique);

                    done();
                });
        });

    });

    describe('Hook#update database errors', function() {
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
                }], function(error, users) {
                    if (error) {
                        done(error);
                    } else {
                        done();
                    }
                });
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

                    done();
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

                    done();
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

});
