const MongoClient = require( 'mongodb' ).MongoClient;
const url = process.env['DAILY_DB']

var _db;

module.exports = {

  connectToServer: async function( callback ) {
    MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
      _db  = client.db('daily');
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  }
};