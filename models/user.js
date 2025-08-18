const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const schema = mongoose.Schema;
const UserSchema = new schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);