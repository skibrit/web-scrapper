import mongoose from "mongoose";

const PropertySchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    images: [
      {
        key: {
          type: String
        },
        url: {
          type: String
        }
      }
    ]
  },
  { collection: "Property" }
);

module.exports = mongoose.model("Property", PropertySchema);
