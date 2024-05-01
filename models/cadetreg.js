const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const CadetregSchema = new Schema({
    regimentno: {
        type: String,
        required: true,
        unique: true

    },
    id: {
        type: Number,
        required: true,
        unique: true,
        ref: 'User'
    },
    year: {
        type: Number,
        required: true,

    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,

        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true,

    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    Bloodgroup: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true
    },
    fathername: {
        type: String,
        required: true,
    },
    mothername: {
        type: String,
        required: true,
    },
    DOB: {
        type: String,
        required: true,

    },
    caste: {
        type: String,
        required: true,
    },
    Address: {
        type: String,
        required: true,
    },
    parentmobno: {
        type: Number,
        required: true,

    },
    aadharno: {
        type: Number,
        required: true,
        unique: true,

    }
});
module.exports = mongoose.model('Cadetreg', CadetregSchema);