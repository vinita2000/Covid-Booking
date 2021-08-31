const User = require('../models/user');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.query['userId']});
    res.status(200).json({message: 'Success', data: user});
  } catch (e) {
    res.status(400).json({message: e.message});
  }
};
