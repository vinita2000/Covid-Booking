const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
   name:String,
   email: {
      type: String,
      required: [true, 'Email required'],
      unique: true,
      validator: [validator.isEmail, 'Invalid email']
   },
   password: {
      type: String,
      required: [true, 'Password required']
   },
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
   bookings: [{
      labID: String,
      testName: String,
      labName: String,
      bookingTime: {
         type:String,
         default:'00.00'
      },
      bookingDate: {
         type: Date,
         default: Date.now()
      }
   }]
}, {timestamps:true});

schema.pre('save', async function (next) {
   this.password = await bcrypt.hash(this.password, 8);
   next();
});

schema.methods.matchPassword = async function(password, encryptedPass){
   return await bcrypt.compare(password, encryptedPass);
};

const User = mongoose.model('user', schema);
module.exports = User;