var fs = require( "fs" ),
    child_process = require( "child_process" ),
    exec = child_process.exec;

const BUILD_DIR = "./build",
      SRC_DIR = "./js",
      DIST_DIR = "./dist",
      PROFILES_DIR = BUILD_DIR + "/profiles",
      DEFAULT_PROFILE = PROFILES_DIR + "/default.js"
      R_JS = BUILD_DIR + "/r.js";

var profile = DEFAULT_PROFILE;
if ( process.env.profile ) {
  profile = PROFILES_DIR + "/" + process.env.profile + ".js";
} //if

function templateReplace( input, replaceDict ) {

  var output = input + "";

  for ( var inPhrase in replaceDict ) {
    var replacement = replaceDict[ inPhrase ],
        regex = new RegExp( "%" + inPhrase + "%", "g" );
    output = output.replace( regex, replacement );
  } //for

  return output;

} //templateReplate

directory( DIST_DIR );

desc( "Create module" );
task( "module", function() {
  var moduleName = process.env.name || "module" + Date.now(),
      fileName = SRC_DIR + "/" + moduleName + ".js";

  var input = fs.readFileSync( BUILD_DIR + "/module-template.js" );

  var output = templateReplace( input, {
    module: moduleName
  });

  fs.writeFileSync( fileName, output );
  
});


desc( "Build trackliner" );
task( "default", function() {
  jake.Task[ DIST_DIR ].invoke();
  function nodeExecHandler( error, stdout, stderr ) {
    if( !error ) {
    }
    else {
      console.log( stderr );
    } //if
  } //nodeExecHandler

  try {
    fs.lstatSync( profile );
    exec( "node " + R_JS + " -o " + profile );
  }
  catch( e ) {
    console.log( "ERROR: Profile " + profile + " dost not exist." );
  } //try
});

desc( "Clean trackliner" );
task( "clean", function() {
  function removeFiles( dirName ) {
    var dir = fs.readdirSync( dirName );
    for ( var item in dir ) {
      var itemPath = dirName + "/" + dir[ item ];
      var stat = fs.lstatSync( itemPath );
      if ( stat.isDirectory() ) {
        removeFiles( itemPath );
        fs.rmdir( itemPath );
      }
      else {
        fs.unlink( itemPath );
      } //if
    } //for
  } //removeFiles
  try {
    fs.lstatSync( DIST_DIR );
    removeFiles( DIST_DIR );
    fs.rmdir( DIST_DIR );
  }
  catch( e ) {
    console.log( "\"" +  DIST_DIR + "\" does not exist" );
  } //try
});
