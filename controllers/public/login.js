

const User = require('../../models/user');

exports.login = async (req, res) => {
  try {

    const {email, password} = req.body;

    const user = await User.findOne({email});
    
    if (! user) {
      res.status(401).json({message: "No such user"});
      return;
    }
    // match user password
    const matched = await user.matchPassword(password, user.password);
    if (! matched) {
      res.status(401).json({message: 'Incorrect Password or Email'});
      return;
    }
    res.status(200).json({
      message: "Logged In", data: user
    });

  } catch (e) {
    res.status(401).json({message: e.message});
  }
};