const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'minimum password length is 6 characters'],
    },
    isTeacher: {
        type: Boolean,
        required: [false, "Teacher check failed"]
    },
    schedule: [{ type: String }]
});

// fire a function after doc saved to DB
// userSchema.post('save', function (doc, next) {
//     console.log('new user was created & saved', doc);
//     next();
// })

//fire a function before doc saved to DB
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Static method to login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

const User = mongoose.model('user', userSchema);

module.exports = User;



// maybe use an if if else statement when checking user in checkUser function that checks if teacher secret is there or teams 2 secret else 