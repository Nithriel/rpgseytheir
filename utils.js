const MongoClient = require('mongodb').MongoClient;

var _dbUser = null;

getDb = () => {
    return _dbUser;
};

getObjectId = () => {
    return require('mongodb').ObjectID;
};

init = (callback) => {
    MongoClient.connect('mongodb+srv://RaphaelPletz:Pletz2000@rpgseytheir-l3lko.mongodb.net/test?retryWrites=true', (err, client) => {
        if (err) {
            return console.log('Unable to connect to DB');
        }
        _dbUser = client.db();
        console.log('Successfully connected to MongoDB server');
    });
};

module.exports = {
    getDb: getDb,
    getObjectId: getObjectId,
    init: init
};