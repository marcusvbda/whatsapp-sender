const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
    name: 'string', 
    size: 'string' 
});
const Session = mongoose.model('Session', schema);
module.exports = Session;