const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    img: {
        type: String,  // This can store the image path or base64 string
        required: false,  // Optional image field
    }
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

const User = mongoose.model('User', userSchema);

const issueSchema = new Schema({
    customerServiceID: {
        type: String,
        required: true,
        unique: true,  // Ensure the ID is unique
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User schema
        required: true,
    },
    issue: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'In Review', 'Resolved', 'In Progress', 'On Hold', 'Open'],  // Ensure status has valid values
        required: true,
    },
    attachment: {
        type: String,  // Path to attachment file
        required: false,
    },
    contractLink: {
        type: String,  // Path to contract if applicable
        required: false,
    }
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

const Issue = mongoose.model('Issue', issueSchema);


module.exports = { User, Issue }