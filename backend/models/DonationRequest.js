const mongoose = require('mongoose');

const donationRequestSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Individual', 'Family', 'Organization', 'Community'],
      default: 'Individual',
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    goal: {
      type: Number,
      required: true,
      min: 1,
    },
    area: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    urgent: {
      type: Boolean,
      default: false,
    },
    methods: {
      type: [String],
      default: [],
    },
    docs: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: '',
    },
    contactName: {
      type: String,
      required: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      default: '',
      trim: true,
    },
    relationship: {
      type: String,
      default: 'Self',
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    submitted: {
      type: String,
      default: 'Just now',
    },
    raised: {
      type: String,
      default: '৳ 0 raised',
    },
    percent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.DonationRequest || mongoose.model('DonationRequest', donationRequestSchema);
