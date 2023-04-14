const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DonorVerificationSchema = new Schema({
    donorID: String,
    uniqueString: String,
    createdAt: Date,
    expiresAt: Date,
});

const DonorVerification = mongoose.model('DonorVerification', DonorVerificationSchema);

module.exports = DonorVerification ;