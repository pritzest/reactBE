const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        _id: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        profile_picture_url: {
            type: String,
            required: true
        },
        password_chances: {
            type: Number,
            default: 3
        },
        created_at: {
            type: String,
            required: true
        },
        updated_at: {
            type: String,
            required: true
        },
        deleted_at: {
            type: String,
            default: null
        }
    }
);

module.exports = mongoose.model('User', userSchema);
