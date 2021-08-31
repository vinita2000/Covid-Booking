const Labs = require('../../models/lab');

exports.getLab = async (req, res) => {
  try {

    const _id = req.query['id'];
    const lab = await Labs.findOne({_id});

    res.status(200).json({
      message: "Success",
      data : lab
    });

  } catch (e) {
    res.status(401).json({message: e.message});
  }
};

