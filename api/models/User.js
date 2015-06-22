var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

module.exports = {
  
	attributes: {
		name: {
			type: 'string',
			required: true,
			minLength: 2,
			maxLength: 30
		},

		username: {
			type: 'string',
			required: true,
			unique: true,
			minLength: 2,
			maxLength: 30
		},

		email:{ 
			type: 'email',
			required: true,
			unique: true
		},

		password:{
			type: 'string',
			required: true,
			minLength: 6,
			maxLength: 50
		},
		
		verifyPassword: function (password) {
			return bcrypt.compareSync(password, this.password);
		},

		changePassword: function(newPassword, cb){
			this.newPassword = newPassword;
			this.save(function(err, u) {
				return cb(err,u);
			});
		},

		toJSON: function() {
			var obj = this.toObject();
			return obj;
		}
	},

	//model validation messages definitions
	validationMessages: {
		name: {
			type: 'You should submit an string',
			required: 'You should enter your name',
	        minLength: 'Your name should be at least 2 characters long',
	        maxLength: 'Your name should be shorter than 30 characters'
		},
		username: {
			type: 'You should submit an string',
			required: 'You should enter a username',
			unique: 'Selected username is already taken',
	        minLength: 'Your name should be at least 2 characters long',
	        maxLength: 'Your name should be shorter than 30 characters'
		},
	    email: {
	    	type: 'You should submit an string',
	        required: 'Email address is required',
	        unique: 'Email address is already taken',
	        email: 'Provide valid email address'
	    },
	    password: {
	    	type: 'You should submit an string',
	        required: 'You should enter your password',
	        minLength: 'Your password should be at least 6 characters long',
	        maxLength: 'Your password should be shorter than 50 characters'
	    }
	},

	beforeCreate: function (attrs, cb) {
		bcrypt.hash(attrs.password, SALT_WORK_FACTOR, function (err, hash) {
			attrs.password = hash;
			return cb();    
		});
	},

	beforeUpdate: function (attrs, cb) {
		if(attrs.newPassword){
			bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
				if (err) return cb(err);

				bcrypt.hash(attrs.newPassword, salt, function(err, crypted) {
					if(err) return cb(err);

					delete attrs.newPassword;
					attrs.password = crypted;
					return cb();
				});
			});
		} else {
			return cb();
		}
	}
};
