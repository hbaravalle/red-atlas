import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    address: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      lat: {
        type: String,
        required: true,
      },
      lng: {
        type: String,
        required: true,
      },
    },
    images: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      enum: ['apartment', 'house', 'office', 'land'],
      required: true,
    },
    status: {
      type: String,
      enum: ['sale', 'rent'],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
      required: true,
    },
    area: {
      type: Number,
    },
    owner: {
      name: {
        type: String,
      },
      contact: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Property', propertySchema);
