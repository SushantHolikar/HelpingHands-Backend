const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DonorSchema = new Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    verified: { type: Boolean },
    amount: {
        type: Number,
            default: 0
    },
    date: {
        type: Date,
        default: Date.now()
    },
    profileImage: {
        type: String,
        default: "https://png.pngitem.com/pimgs/s/508-5087236_tab-profile-f-user-icon-white-fill-hd.png"
    }
});

const Donor = mongoose.model('Donor', DonorSchema);

module.exports = Donor;