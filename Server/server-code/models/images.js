const mongoose = require('mongoose');

const schema = new mongoose.schema({

});

const Images = mongoose.model('images', schema);
module.exports = Images;