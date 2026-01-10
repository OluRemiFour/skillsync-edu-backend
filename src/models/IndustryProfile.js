const mongoose = require('mongoose');

const industryProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  companyUrl: {
    type: String
  },
  about: {
    type: String
  },
  goals: {
    type: String
  },
  address: {
    type: String
  }
}, {
  timestamps: true
});

const IndustryProfile = mongoose.model('IndustryProfile', industryProfileSchema);

module.exports = IndustryProfile;
