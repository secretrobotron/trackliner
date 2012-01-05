/*jshint white: false, strict: false, plusplus: false, evil: true,
  onevar: false, nomen: false */
/*global require: false, document: false, console: false, window: false,
  setTimeout: false */

/**
 * In the source case, use document.write to write out the require tag,
 * and load all moduels as distinct scripts for debugging. After a build,
 * all the modules are inlined, so will not use the document.write path.
 * Use has() testing module, since the requirejs optimizer will convert
 * the has test to false, and minification will strip the false code
 * branch. http://requirejs.org/docs/optimization.html#hasjs
 */
(function (root) {

    // Create a shell function that can receive calls from the web page, even
    // though the parts of the library are still loading.
    var trackliner = function() {
      if ( !trackliner.__waiting ) {
        trackliner.__waiting = [];
      } //if
      trackliner.__waiting.push( arguments );
    };

    // Create a global for the library.
    if ( !root.trackliner ) {
      root.trackliner = trackliner;
    } //if

    // Get the location of the trackliner source.
    // The last script tag should be the trackliner source
    // tag since in dev, it will be a blocking script tag,
    // so latest tag is the one for this script.
    var scripts = document.getElementsByTagName( 'script' ),
    path = scripts[scripts.length - 1].src;
    path = path.split( '/' );
    path.pop();
    path = path.join( '/' ) + '/';

    if ( !root.requirejs ) {
      document.write( '<script src="' + path + '../lib/require.js"></' + 'script>' );
    } //if

    // Set up paths to find scripts.
    document.write('<script>' +
      '(function(){' +
      'var ctx = requirejs.config({ ' +
        'baseUrl: "' + path + '",' +
        'context: "trackliner",' +
        'paths: {' +
          'trackliner: "' + path + '"' +
          // Paths are relative to baseUrl; Notice the commas!
        '}' +
      '});' +
      'ctx(["main"])' +
      '})()' +
    '</script>');

}( this ));
