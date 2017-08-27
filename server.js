var express = require( 'express' );
var dbsearch = require( './dbsearch' );
var app     = express();
var query, result, host, original_url, newShortUrlObj,
    url_regexp = /http[s]?\:\/\/www.[\w]+.[com|cn|org|co]/;
app.use( express.static( 'public' ) );
app.get( '/', function( req, res ) {
  res.sendFile( __dirname + '/views/index.html');
})
app.get( '/new/:protocal://:original_url', function( req, res ){
  host = req.headers.host;
  original_url = req.params.protocal + '://' + req.params.original_url;
  query = {
    original_url : original_url
  };
  if( !url_regexp.test( original_url ) ) {
    res.end( JSON.stringify( {
      error: "Wrong url format, make sure you have a valid protocol and real site."
    }))
  }
  console.log( host );
  console.log('original_url:',original_url);
  console.log( 'url', req.url );
  dbsearch.findShortUrl( query ,function(err, result) {
    if( result.length !== 0 ){
      res.end( JSON.stringify( result[0] ));
    } else {
      short_url = host;
      newShortUrlObj = {
        original_url : original_url,
        short_url    : short_url
      }
      dbsearch.addShortUrl( newShortUrlObj, function( result ){
        result = result[0];
        delete result._id;
        res.end( JSON.stringify(result) );
      });
    }
  });
})
app.get( '/:id', function( req, res) {
  var query = {
    short_url:  req.headers.host +'/'+ req.params.id
  };
  dbsearch.findShortUrl( query, 
    function( err, result){
      if( err ) { throw err }
      res.redirect( result[0].original_url);
  })
});
app.listen( 4000, function(){
  console.log( 'Your app is listening on port 4000' );
})