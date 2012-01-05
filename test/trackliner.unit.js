document.addEventListener('DOMContentLoaded', function (e) {

  var tl;

  module( "Basic Functionality", {
    setup: function(){
      tl = new trackliner.TrackLiner({
        element: "container",
        dynamicTrackCreation: true
      });
    },
    teardown: function(){
      document.getElementById( "container" ).innerHTML = "";
    }
  });

  test( "Tracks", function(){
    expect( 6 );
    var addedCount = 0,
        removedCount = 0;
    function trackAdded( e ){
      ++addedCount;
    }
    function trackRemoved( e ){
      ++removedCount;
    }
    tl.listen( "trackadded", trackAdded );
    tl.listen( "trackremoved", trackRemoved );
    var t1 = tl.createTrack( "track1" ),
        t2 = tl.createTrack( "track2" );
    tl.createTrack( "track3" );
    equal( addedCount, 3, "event handlers called" );
    equal( tl.numTracks, 3, "track added" );
    tl.removeTrack( t1 );
    tl.removeTrack( t2 );
    equal( removedCount, 2, "event handlers called" );
    equal( tl.numTracks, 1, "tracks added" );
    tl.unlisten( "trackadded", trackAdded );
    tl.unlisten( "trackremoved", trackRemoved );
    var t4 = tl.createTrack( "track4" );
    tl.removeTrack( t4 );
    equal( addedCount, 3, "'added' event handlers removed" );
    equal( removedCount, 2, "'removed' event handlers removed" );
  });

  test( "TrackEvents", function(){
    var t1 = tl.createTrack( "track1" ),
        t2 = tl.createTrack( "track2" ),
        globalCount = 0,
        localCount = 0;
    function localTrackEventAdded( e ){
      ++localCount;
    }
    function globalTrackEventAdded(e ){
      ++globalCount;
    }
    function localTrackEventRemoved( e ){
      --localCount;
    }
    function globalTrackEventRemoved( e ){
      --globalCount;
    }
    tl.listen( "trackeventadded", globalTrackEventAdded );
    t1.listen( "trackeventadded", localTrackEventAdded );
    tl.listen( "trackeventremoved", globalTrackEventRemoved );
    t1.listen( "trackeventremoved", localTrackEventRemoved );
    var te1 = t1.createTrackEvent( "trackevent1" );
    var te2 = t1.createTrackEvent( "trackevent2" );
    var te3 = t2.createTrackEvent( "trackevent3" );
    equal( localCount, 2, "local event captured" );
    equal( globalCount, 3, "global events captured" );
    equal( t1.numEvents, 2, "first track has 2 events" );
    equal( t2.numEvents, 1, "second track has 1 event" );
    t1.removeTrackEvent( te1 );
    equal( t1.numEvents, 1, "correct number of trackevents" );
    tl.unlisten( "trackeventadded", globalTrackEventAdded );
    t1.unlisten( "trackeventadded", localTrackEventAdded );
    tl.unlisten( "trackeventremoved", globalTrackEventRemoved );
    t1.unlisten( "trackeventremoved", localTrackEventRemoved );
    t1.removeTrackEvent( te2 );
    t2.removeTrackEvent( te3 );
    equal( globalCount, 2, "stopped listening globally" );
    equal( localCount, 1, "stopped listening locally" );
  });

}, false);
