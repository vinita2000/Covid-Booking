const Labs = require('../../models/lab');
const User = require('../../models/user');

const calculateDistance = (arr, coordinates) => {
  try{
    for(obj of arr){
      let labCoord = obj['address']['location']['coordinates'];
      const r = 6371e3;
      const phi1 = coordinates[0]*Math.PI/180;
      const phi2 = labCoord[0]*Math.PI/180;
      const diffPhi = (labCoord[0] - coordinates[0])*Math.PI/180;
      const diffLambda = (labCoord[1] - coordinates[1])*Math.PI/180;
      const a = Math.sin(diffPhi/2)*Math.sin(diffPhi/2)+Math.cos(phi1)*Math.cos(phi2)*Math.sin(diffLambda/2)*Math.sin(diffLambda/2);
      const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = r*c;
      obj['distance'] = distance;
    }
    return arr;
  }catch(e){
    throw new Error(e.message);
  }
}; 

exports.nearbyLabs = async (req, res) => {
  try {

    const {userId} = req.query;

    const user = await User.findById({_id: userId});

    if (!user)throw new Error('Invalid User');

    const coordinates = user['address']['location']['coordinates'];

    let labs = await Labs.aggregate([
      {
        $project: {
          address: 1,
          name: 1,
          _id: 0
        }
      }
    ]);

    labs = calculateDistance(labs, coordinates);
    labs.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      message: "Success",
      data : labs
    });

  } catch (e) {
    res.status(401).json({message: e.message});
  }
};