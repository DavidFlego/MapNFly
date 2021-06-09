const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
//  p-l-m simplifies building username and password login with Passport.

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    sessions: [{
       type: Schema.Types.ObjectId,
       ref: 'Training-Session'
    }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);