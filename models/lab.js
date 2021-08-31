const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name:String,
  address: {
    name: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  tests: [{
    name: { type: String, required: [true, 'Test name required']},
    slots: { type: Number, default: 0 }
  }],
  reviews: [String]

}, {timestamps:true});

const Lab = mongoose.model('lab', schema);
module.exports = Lab;