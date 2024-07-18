const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowerdcase: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
});

const User = mongoose.model('user', userSchema)

module.exports = User;