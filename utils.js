const MongoClient = require('mongodb').MongoClient;

var _dbUser = null;

getDb = () => {
    return _dbUser;
};

getObjectId = () => {
    return require('mongodb').ObjectID;
};

init = (callback) => {
    var MONGODB = 'mongodb://RaphaelPletz:Pletz2000@ds157516.mlab.com:57516/heroku_w5tb41f6';
    MongoClient.connect(MONGODB || 'mongodb://localhost:27017/forumdb', (err, client) => {
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