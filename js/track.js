define( [ "./eventmanager", "./trackevent" ], function( EventManager, TrackEvent ){

  var __guid = 0,
      __tracks = {};

  var Track = function( options ) {

    var _id = "trackLiner" + __guid++,
        _events = {},
        _this = this,
        _element = document.createElement( "div" ),
        _scale = options.scale || 1,
        _em = new EventManager( _this );

    __tracks[ _id ] = this;

    _element.className = "trackliner-track";
    _element.id = _id;

    $( _element ).droppable({ 
      greedy: true,
      // this is dropping an event on a track
      drop: function( e, ui ){

        var formerTrackId = ui.draggable[ 0 ].parentNode.id,
            formerTrack = __tracks[ formerTrackId ],
            eventId = ui.draggable[ 0 ].id,
            trackEvent;

        if( !formerTrack ){
          var clientRects = _element.parentNode.getClientRects();
          _this.createTrackEvent({
            left: ( e.clientX - clientRects[ 0 ].left ) / _scale,
            width: 50,
            innerHTML: ui.draggable[ 0 ].innerHTML
          });
        }
        else if( formerTrack && formerTrack !== _this ){
          trackEvent = formerTrack.getTrackEvent( eventId );
          formerTrack.removeTrackEvent( trackEvent );
          _this.addTrackEvent( trackEvent );
          _em.dispatch( "trackeventdropped", ui );
        }
        else if( trackEvent ){
          trackEvent = _this.getTrackEvent( eventId );
          if( trackEvent){
            trackEvent.dispatch( "trackeventupdated", ui );
          } //if
        } //if
      }
    });

    this.getElement = function(){
      return _element;
    };

    this.createTrackEvent = function( inputOptions ){
      var te = new TrackEvent( inputOptions );
      _this.addTrackEvent( te );
      _em.dispatch( "trackeventcreated", te );
      return te;
    }; //createTrackEvent

    function onTrackEventClicked( e ){
    } //onTrackEventClicked
    function onTrackEventDblClicked( e ){
    } //onTrackEventDblClicked
    function onTrackEventSelected( e ){
    } //onTrackEventSelected
    function onTrackEventDeselected( e ){
    } //onTrackEventDeselected
    function onTrackEventUpdated( e ){
    } //onTrackEventUpdated

    this.addTrackEvent = function( trackEvent, ui ){
      _events[ trackEvent.element.id ] = trackEvent;
      _element.appendChild( trackEvent.element );
      trackEvent.trackId = _id;
      ui = ui || false;
      trackEvent.listen( "trackeventclicked", onTrackEventClicked );
      trackEvent.listen( "trackeventdblclicked", onTrackEventDblClicked );
      trackEvent.listen( "trackeventselected", onTrackEventSelected );
      trackEvent.listen( "trackeventdeselected", onTrackEventDeselected );
      trackEvent.listen( "trackeventupdated", onTrackEventUpdated );
      trackEvent.repeatEvents( _em );

      _em.dispatch( "trackeventadded", {
        track: _this,
        trackEvent: trackEvent,
        ui: ui
      });

      if( ui ){
        trackEvent.selected = true;
      } //if
      
      return trackEvent;
    };

    this.updateTrackEvent = function( trackEvent ){
      var eventElement = trackEvent.element,
          track = self.getTrack( trackEvent.trackId );

      eventElement.style.top = "0px";
      eventElement.style.width = trackEvent.options.width + "px";
      eventElement.style.left = trackEvent.options.left + "px";

      _em.dispatch( "trackeventupdated", {
        track: track,
        trackEvent: trackEvent,
        ui: false
      });

      return trackEvent;
    };

    this.getTrackEvent = function( id ){
      return _events[ id ];
    };

    this.getTrackEvents = function(){
      return _events;
    };

    this.removeTrackEvent = function( trackEvent ){
      if( !( trackEvent instanceof TrackEvent ) ){
        trackEvent = _events[ trackEvent ];
      } //if

      delete _events[ trackEvent.id ];
      _element.removeChild( trackEvent.element );

      trackEvent.unlisten( "trackeventclicked", onTrackEventClicked );
      trackEvent.unlisten( "trackeventdblclicked", onTrackEventDblClicked );
      trackEvent.unlisten( "trackeventselected", onTrackEventSelected );
      trackEvent.unlisten( "trackeventdeselected", onTrackEventDeselected );
      trackEvent.unlisten( "trackeventupdated", onTrackEventUpdated );
      trackEvent.unRepeatEvents( _em );

      _em.dispatch( "trackeventremoved", trackEvent );
      return trackEvent;
    };

    Object.defineProperties( this, {
      id: {
        get: function(){ return _id; }
      },
      numEvents: {
        get: function(){ return Object.keys( _events ).length; }
      },
      scale: {
        get: function(){ return _scale; },
        set: function( scale ){
          _scale = scale;
          for( e in _events ){
            if( _events.hasOwnProperty( e ) ){
              _events[ e ].scale = scale;
            } //if
          } //for
        }
      },
      element: {
        get: function(){ return _element; }
      }
    });

  }; //Track

  return Track;

});
