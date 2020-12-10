const mongoose = require('mongoose');
const config = require('config');
const mongoURI = config.get('mongoURI');

const dbConnected = () => {
    mongoose.connect(mongoURI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    })
        .then(() => { console.log('MongoDbConnection successfully :-)') })
        .catch(err => { console.log('mongodb connection failed :-( ', err); });

}

module.exports = dbConnected;