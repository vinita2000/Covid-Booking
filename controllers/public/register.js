const User = require('../../models/user');

exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json({message: 'User registered', data: user});
  } catch (e) {
    res.status(400).json({message: e.message});
  }
};
