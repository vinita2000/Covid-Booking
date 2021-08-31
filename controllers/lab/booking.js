const Labs = require('../../models/lab');
const User = require('../../models/user');
const nodemailer = require('nodemailer');
const SENDER_MAIL = process.env.SENDER_MAIL;
const SENDER_PASSWORD = process.env.SENDER_PASSWORD;

const sendMail = (name, mailto, bookingInfo) => {
  try{
    return new Promise((resolve,reject)=>{

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: SENDER_MAIL,
          pass: SENDER_PASSWORD
        }
      });

      // let reqDataString = JSON.stringify(bookingInfo, undefined, 4);

      let mailOptions = {
        from: SENDER_MAIL,
        to: `${mailto}`,
        subject: 'Covid Slot Booking Successful !!',
        html: `
            <h1>Booking Details for ${name}</h1><br>
            <h3> Test: ${bookingInfo['testName']}</h3><br>
            <h3> Lab: ${bookingInfo['labName']}</h3><br>
            <h3> Date: ${bookingInfo['bookingDate']}</h3><br>
            <h3> Time: ${bookingInfo['bookingTime']}</h3><br>
          `
      };
  
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log("error is " + error);
          resolve(false);
        } 
        else {
          console.log('Email sent: ' + info.response);
          resolve(true);
        }
      });
    });

  }catch(e){
    throw new Error(e.message);
  }
}

exports.bookSlot = async (req, res) => {
  try {

    const {labId, test, userId} = req.query;
    let slots = 0;

    let labDetails = await Labs.findOne({_id: labId}, {tests: 1, name: 1});

    if (!labDetails) throw new Error('Invalid Lab');
    
    for (obj of labDetails['tests']){
      if (obj['name'] == test){
        slots = obj['slots'];
      }
    }

    if (slots>0 && test=='RT-PCR' ){
      await Labs.findByIdAndUpdate(
        {_id:labId},
        { 
          $set: {
           'tests.0.slots': slots-1
          }
        },
      {new: true});
    }

    if (slots>0 && test=='Antigen' ){
      await Labs.findByIdAndUpdate(
        {_id:labId},
        { 
          $set: {
           'tests.1.slots': slots-1
          }
        },
      {new: true});
    }

    let data;
  
    if (slots>0 && (test== 'RT-PCR' || test == 'Antigen')){
      const temp = {
        labName: labDetails['name'],
        labID: labDetails['_id'],
        testName: test
      };
      data = await User.findByIdAndUpdate(
        {_id: userId},
        {
          $push: { 'bookings': temp }
        },
        {new: true});

      // send booking mail
      const bookingsLen = (data['bookings']).length;
      const mail = await sendMail(data['name'], data['email'], data['bookings'][bookingsLen-1]);
    }

    if (data){
      data =  { bookings: data['bookings'], _id: data['_id'], name: data['name']};
    }
    res.status(200).json({
      message: "Booking Successful",
      data 
    });

  } catch (e) {
    res.status(401).json({message: e.message});
  }
};
