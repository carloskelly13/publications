
/**
 * Publications JS API
 * User Model
 * Michael Kelly and Carlos Paelinck
 */

var bcrypt = require('bcrypt'),
    mongoose = require('mongoose');

var Schema = mongoose.Schema,
    kSaltFactor = 10;

var userSchema = new Schema({
    name: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    modified: { type: Date, 'default': Date.now },
    temporary: { type: Boolean },
    documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }]
});

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(kSaltFactor, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods = {
    validatePassword: function(password, cb) {
        bcrypt.compare(password, this.password, function(err, isValid) {
            if (err) return cb(err);
            cb(null, isValid);
        });
    }
};

module.exports = mongoose.model('User', userSchema);