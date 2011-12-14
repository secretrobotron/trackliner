document.addEventListener('DOMContentLoaded', function (e) {

  module( "TrackLiner" );
  
  test( "Events", function() {

    var expects = 74,
        count = 0;

    var tracksAdded = [],
        tracksRemoved = [],
        trackEventsAdded = [],
        trackEventsRemoved = [],
        trackEventsUpdated = [],
        clicked = [],
        doubleclicked = [],
        selected = [],
        deselected = [];

    var trackLiner = new TrackLiner({
      element: "container",
      dynamicTrackCreation: true
    });
    
    trackLiner.listen( "trackadded", function(e) {
      tracksAdded.push(e);
    });
    
    trackLiner.listen( "trackremoved", function(e) {
      tracksRemoved.push(e);
    });
    
    trackLiner.listen( "trackeventadded", function(e) {
      trackEventsAdded.push(e);
    });
    
    trackLiner.listen( "trackeventremoved", function(e) {
      trackEventsRemoved.push(e)
    });
    
    trackLiner.listen( "trackeventupdated", function(e) {
      trackEventsUpdated.push(e);
    });
    
    trackLiner.listen( "trackeventselected", function(e) {
      selected.push(e);
    });
    
    trackLiner.listen( "trackeventdeselected", function(e) {
      deselected.push(e);
    });
        
    expect( expects );
    
    trackLiner.addTrack( trackLiner.createTrack( "track1" ) );
    equal( tracksAdded.length, 1, "track added" );
    equal( tracksAdded[ 0 ].type, "trackadded", "trackadded event type" );
    equal( tracksAdded[ 0 ].target, "trackLiner", "trackadded event target" );
    equal( tracksAdded[ 0 ].data.track.getElement().children[ 0 ].innerHTML, "track1", "trackadded event innerHTML set" );
    
    var newTrack1 = trackLiner.createTrack( "track2" );
    trackLiner.addTrack( newTrack1 );
    equal( tracksAdded.length, 2, "track added" );
    equal( tracksAdded[ 1 ].data.track.getElement().children[ 0 ].innerHTML, "track2", "trackadded event innerHTML set" );
    
    trackLiner.removeTrack( newTrack1 );
    equal( tracksRemoved.length, 1, "track removed" );
    equal( tracksRemoved[ 0 ].type, "trackremoved", "trackremoved event type" );
    equal( tracksRemoved[ 0 ].data.track.getElement().children[ 0 ].innerHTML, "track2", "trackremoved event innerHTML set" );
    
    trackLiner.addTrack( newTrack1 );
    equal( tracksAdded.length, 3, "track added" );
    equal( tracksAdded[ 2 ].data.track.getElement().children[ 0 ].innerHTML, "track2", "trackadded event innerHTML set" );
    
    trackLiner.addTrack( trackLiner.createTrack( "track3" ) );
    equal( tracksAdded.length, 4, "track added" );
    equal( tracksAdded[ 3 ].data.track.getElement().children[ 0 ].innerHTML, "track3", "trackadded event innerHTML set" );
    
    trackLiner.removeTrack( newTrack1 );
    equal( tracksRemoved.length, 2, "track removed" );
    equal( tracksRemoved[ 1 ].data.track.getElement().children[ 0 ].innerHTML, "track2", "trackremoved event innerHTML set" );
    
    var newTrack2 = trackLiner.createTrack( "track4" );
    trackLiner.addTrack( newTrack2 );
    equal( tracksAdded.length, 5, "track added" );
    equal( tracksAdded[ 4 ].data.track.getElement().children[ 0 ].innerHTML, "track4", "trackadded event innerHTML set" );
    
    var trackEvent1 = newTrack1.createTrackEvent({
      left: 10,
      width: 10,
      innerHTML: "trackEvent1"
    });
    newTrack2.addTrackEvent( trackEvent1 );
    equal( trackEventsAdded.length, 1, "trackevent added" );
    equal( trackEventsAdded[ 0 ].type, "trackeventadded", "trackeventadded event type" );
    equal( trackEventsAdded[ 0 ].target, "trackLiner", "trackeventadded event target" );
    equal( trackEventsAdded[ 0 ].data.trackEvent.options.left, 10, "trackeventadded event left set" );
    equal( trackEventsAdded[ 0 ].data.trackEvent.options.width, 10, "trackeventadded event width set" );
    equal( trackEventsAdded[ 0 ].data.trackEvent.options.innerHTML, "trackEvent1", "trackeventadded event innerHTML set" );
    equal( trackEventsAdded[ 0 ].data.track.getElement().children[ 0 ].innerHTML, "track4", "trackeventadded event track innerHTML set" );

    newTrack2.removeTrackEvent( trackEvent1.element.id );
    equal( trackEventsRemoved.length, 1, "trackevent removed" );
    equal( trackEventsRemoved[ 0 ].type, "trackeventremoved", "trackeventremoved event type" );
    equal( trackEventsRemoved[ 0 ].target, "trackLiner", "trackeventremoved event target" );
    equal( trackEventsRemoved[ 0 ].data.options.left, 10, "trackeventremoved event left set" );
    equal( trackEventsRemoved[ 0 ].data.options.width, 10, "trackeventremoved event width set" );
    equal( trackEventsRemoved[ 0 ].data.options.innerHTML, "trackEvent1", "trackeventremoved event innerHTML set" );
    
    var trackEvent2 = newTrack1.createTrackEvent({
      left: 20,
      width: 20,
      innerHTML: "trackEvent2"
    });
    newTrack1.addTrackEvent( trackEvent2 );
    equal( trackEventsAdded.length, 2, "trackevent added" );
    equal( trackEventsAdded[ 1 ].type, "trackeventadded", "trackeventadded event type" );
    equal( trackEventsAdded[ 1 ].target, "trackLiner", "trackeventadded event target" );
    equal( trackEventsAdded[ 1 ].data.trackEvent.options.left, 20, "trackeventadded event left set" );
    equal( trackEventsAdded[ 1 ].data.trackEvent.options.width, 20, "trackeventadded event width set" );
    equal( trackEventsAdded[ 1 ].data.trackEvent.options.innerHTML, "trackEvent2", "trackeventadded event innerHTML set" );
    equal( trackEventsAdded[ 1 ].data.track.getElement().children[ 0 ].innerHTML, "track2", "trackeventadded event track innerHTML set" );
    
    trackEvent2.options.left = 30;
    trackEvent2.options.width = 30;
    newTrack1.updateTrackEvent( trackEvent2 );
    equal( trackEventsUpdated.length, 1, "trackevent updated" );
    equal( trackEventsUpdated[ 0 ].type, "trackeventupdated", "trackeventupdated event type" );
    equal( trackEventsUpdated[ 0 ].target, "trackLiner", "trackeventupdated event target" );
    equal( trackEventsUpdated[ 0 ].data.trackEvent.options.left, 30, "trackeventupdated event left set" );
    equal( trackEventsUpdated[ 0 ].data.trackEvent.options.width, 30, "trackeventupdated event width set" );
    equal( trackEventsUpdated[ 0 ].data.trackEvent.options.innerHTML, "trackEvent2", "trackeventupdated event innerHTML set" );
    equal( typeof trackEventsUpdated[ 0 ].data.track, "undefined", "trackeventupdated event track innerHTML set" );
    
    trackLiner.addTrack( newTrack1 );
    equal( tracksAdded.length, 6, "track added" );
    equal( tracksAdded[ 5 ].data.track.getElement().children[ 0 ].innerHTML, "track2", "trackadded event innerHTML set" );
    
    trackEvent2.options.left = 40;
    trackEvent2.options.width = 40;
    newTrack1.updateTrackEvent( trackEvent2 );
    equal( trackEventsUpdated.length, 2, "trackevent updated" );
    equal( trackEventsUpdated[ 1 ].type, "trackeventupdated", "trackeventupdated event type" );
    equal( trackEventsUpdated[ 1 ].target, "trackLiner", "trackeventupdated event target" );
    equal( trackEventsUpdated[ 1 ].data.trackEvent.options.left, 40, "trackeventupdated event left set" );
    equal( trackEventsUpdated[ 1 ].data.trackEvent.options.width, 40, "trackeventupdated event width set" );
    equal( trackEventsUpdated[ 1 ].data.trackEvent.options.innerHTML, "trackEvent2", "trackeventupdated event innerHTML set" );
    equal( trackEventsUpdated[ 1 ].data.track.getElement().children[ 0 ].innerHTML, "track2", "trackeventupdated event track innerHTML set" );
    
    trackEvent2.select();
    equal( selected.length, 1, "trackevent selected" );
    equal( selected[ 0 ].type, "trackeventselected", "trackeventselected event type" );
    equal( selected[ 0 ].target, "trackLiner", "trackeventselected event target" );
    equal( selected[ 0 ].data.trackEvent.options.left, 40, "trackeventselected event left set" );
    equal( selected[ 0 ].data.trackEvent.options.width, 40, "trackeventselected event width set" );
    equal( selected[ 0 ].data.trackEvent.options.innerHTML, "trackEvent2", "trackeventselected event innerHTML set" );
    equal( selected[ 0 ].data.track.getElement().children[ 0 ].innerHTML, "track2", "trackeventselected event track innerHTML set" );
    
    trackEvent1.select();
    equal( selected.length, 2, "trackevent selected" );
    equal( selected[ 1 ].type, "trackeventselected", "trackeventselected event type" );
    equal( selected[ 1 ].target, "trackLiner", "trackeventselected event target" );
    equal( selected[ 1 ].data.trackEvent.options.left, 10, "trackeventselected event left set" );
    equal( selected[ 1 ].data.trackEvent.options.width, 10, "trackeventselected event width set" );
    equal( selected[ 1 ].data.trackEvent.options.innerHTML, "trackEvent1", "trackeventselected event innerHTML set" );
    equal( selected[ 1 ].data.track.getElement().children[ 0 ].innerHTML, "track2", "trackeventselected event track innerHTML set" );
    
    equal( deselected.length, 1, "trackevent deselected" );
    equal( deselected[ 0 ].type, "trackeventdeselected", "trackeventdeselected event type" );
    equal( deselected[ 0 ].target, "trackLiner", "trackeventdeselected event target" );
    equal( deselected[ 0 ].data.trackEvent.options.left, 40, "trackeventdeselected event left set" );
    equal( deselected[ 0 ].data.trackEvent.options.width, 40, "trackeventdeselected event width set" );
    equal( deselected[ 0 ].data.trackEvent.options.innerHTML, "trackEvent2", "trackeventdeselected event innerHTML set" );
    equal( deselected[ 0 ].data.track.getElement().children[ 0 ].innerHTML, "track2", "trackeventdeselected event track innerHTML set" );
  });

  var elems = document.getElementsByClassName('droppable');
  for (var i=0; i<elems.length; ++i) {
    $(elems[i]).draggable({
      helper: 'clone',
      revert: true,
      revertDuration: 0,
    });
  } //for

}, false);
