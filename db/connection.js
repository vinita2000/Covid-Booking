const mongoose = require('mongoose');

const url = process.env.DBURL;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});