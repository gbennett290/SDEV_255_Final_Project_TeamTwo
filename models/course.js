const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required:true
    },
    credits: {
        type: Number,
        required:true
    }
}, {timestamps: true});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;