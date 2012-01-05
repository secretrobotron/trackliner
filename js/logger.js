define( [], function(){

  var Logger = function( name ) {

    this.log = function( message ) {
      console.log( "[" + name + "] " + message );
    }; //log

    this.error = function( message ) {
      throw new Error( "[" + name + "]" + message ); 
    }; //error

  }; //Logger

  return Logger;
});
