'use strict';

//dependencies
var path = require('path');
var expect = require('chai').expect;
var request = require('supertest');

//load messages from locales
var enMessages = require(path.join(__dirname, '..', 'config', 'locales', 'en.json'));
var swMessages = require(path.join(__dirname, '..', 'config', 'locales', 'sw.json'));

describe('Hook#validation#i18n', function() {

    it('should throw custom errors messages from default locales', function(done) {
        Authentication
            .create({}, function(error, user) {

                expect(error.Errors.email).to.exist;

                expect(error.Errors.email[0].message)
                    .to.equal(enMessages['authentication.email.email']);

                expect(error.Errors.email[1].message)
                    .to.equal(enMessages['authentication.email.required']);


                expect(error.Errors.username).to.exist;

                expect(error.Errors.username[0].message)
                    .to.equal(enMessages['authentication.username.string']);

                expect(error.Errors.username[1].message)
                    .to.equal(enMessages['authentication.username.required']);

                expect(error.Errors.birthday).to.exist;

                expect(error.Errors.birthday[0].message)
                    .to.equal(enMessages['authentication.birthday.date']);
                expect(error.Errors.birthday[1].message)
                    .to.equal(enMessages['authentication.birthday.required']);

                done(null, user);
            });
    });


    it('should throw custom errors messages from request locales', function(done) {
        sails.config.i18n.requestLocale = 'sw';

        Authentication
            .create({}, function(error, user) {

                expect(error.Errors.email).to.exist;

                expect(error.Errors.email[0].message)
                    .to.equal(swMessages['authentication.email.email']);

                expect(error.Errors.email[1].message)
                    .to.equal(swMessages['authentication.email.required']);


                expect(error.Errors.username).to.exist;

                expect(error.Errors.username[0].message)
                    .to.equal(swMessages['authentication.username.string']);

                expect(error.Errors.username[1].message)
                    .to.equal(swMessages['authentication.username.required']);

                expect(error.Errors.birthday).to.exist;

                expect(error.Errors.birthday[0].message)
                    .to.equal(swMessages['authentication.birthday.date']);
                expect(error.Errors.birthday[1].message)
                    .to.equal(swMessages['authentication.birthday.required']);

                done(null, user);
            });
    });


    it('should respond with appropriate error using default locale', function(done) {
        var authentication = {};
        request(sails.hooks.http.app)
            .post('/authentication/create')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(authentication)
            .end(function(error, response) {

                var _error = JSON.parse(response.text);

                expect(response.status).to.equal(400);

                expect(_error.email).to.exist;

                expect(_error.email[0].message)
                    .to.equal(enMessages['authentication.email.email']);

                expect(_error.email[1].message)
                    .to.equal(enMessages['authentication.email.required']);


                expect(_error.username).to.exist;

                expect(_error.username[0].message)
                    .to.equal(enMessages['authentication.username.string']);

                expect(_error.username[1].message)
                    .to.equal(enMessages['authentication.username.required']);

                expect(_error.birthday).to.exist;

                expect(_error.birthday[0].message)
                    .to.equal(enMessages['authentication.birthday.date']);
                expect(_error.birthday[1].message)
                    .to.equal(enMessages['authentication.birthday.required']);

                done();
            });
    });


    it('should respond with appropriate error using request locale', function(done) {
        var authentication = {};
        request(sails.hooks.http.app)
            .post('/authentication/create')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Accept-Language', 'sw;q=0.8')
            .send(authentication)
            .end(function(error, response) {

                var _error = JSON.parse(response.text);

                expect(response.status).to.equal(400);

                expect(_error.email).to.exist;

                expect(_error.email[0].message)
                    .to.equal(swMessages['authentication.email.email']);

                expect(_error.email[1].message)
                    .to.equal(swMessages['authentication.email.required']);


                expect(_error.username).to.exist;

                expect(_error.username[0].message)
                    .to.equal(swMessages['authentication.username.string']);

                expect(_error.username[1].message)
                    .to.equal(swMessages['authentication.username.required']);

                expect(_error.birthday).to.exist;

                expect(_error.birthday[0].message)
                    .to.equal(swMessages['authentication.birthday.date']);
                expect(_error.birthday[1].message)
                    .to.equal(swMessages['authentication.birthday.required']);

                done();
            });
    });

});