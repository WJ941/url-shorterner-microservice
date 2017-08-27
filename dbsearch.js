var UrlBindsCol,
    mongodb     = require( 'mongodb' ),
    MongoClient = mongodb.MongoClient,
    url         = "mongodb://richardwong:2016WangShaoSen@ds161483.mlab.com:61483/urlshortenerdb";

var findShortUrl = function( query, callback ) {
  MongoClient.connect( url, function ( err, db ){
    if ( err ) { throw err; }  
    UrlBindsCol =  db.collection( 'UrlBinds' );
    UrlBindsCol.find( query, { _id: false } ).toArray( function(err, res ){
      if ( err ) { throw err; } 
      db.close();
      if( callback ) {
        callback(err, res);
        return res;
      }
    })
  })
};

var addShortUrl = function( newShortUrlObj, callback ){
  MongoClient.connect( url, function ( err, db ){
    if ( err ) { throw err; }
    UrlBindsCol =  db.collection( 'UrlBinds' );
    UrlBindsCol.count( function( err, count ){
      newShortUrlObj.short_url = newShortUrlObj.short_url + '/' + count;
      console.log( 'count: ', count);
      
      UrlBindsCol.insert( newShortUrlObj,function(err, res){
        if( err ) { throw err }
        if( callback ) { callback( res.ops )}
        db.close();
      })
    });
  })
}
module.exports.findShortUrl = findShortUrl;
module.exports.addShortUrl = addShortUrl;