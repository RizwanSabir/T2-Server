const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the User schema
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
        type: String,  // Optional field to store image path or base64 string
        required: false,  // Not mandatory
    }
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

// Create the User model
const UserSupport = mongoose.model('UserSupport', userSchema);

// Define the Issue schema
const issueSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'UserSupport',  // Reference to the User schema
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
        enum: ['Pending', 'In Review', 'Resolved'],  // Ensure status has valid values
        required: true,
    },
    attachment: {
        type: String,  // Optional field for file path
        required: false,
    },
    contractLink: {
        type: String,  // Optional field for contract link
        required: false,
    }
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

// Create the Issue model
const Issue = mongoose.model('Issue', issueSchema);

module.exports = { UserSupport, Issue };
