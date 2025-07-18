const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    Phone: {
        type: String,
        required: true,
        trim: true,

    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        trim: true
    },
    isContact: {
        type: String,
        default: 'New Request'

    }
}, {
    timestamps: true
});

// Export the model
const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;