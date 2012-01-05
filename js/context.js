define( [ "./eventmanager", "./track", "./trackevent" ], function( EventManager, Track, TrackEvent ){

  var Context = function( options ) {

    function init() {

      options = options || {};

      var _tracks = {},
          _userElement,
          _dynamicTrackCreation = options.dynamicTrackCreation,
          _duration = options.duration || 1,
          _scale,
          _parent = document.createElement( "div" ),
          _container = document.createElement( "div" ),
          _em = new EventManager( this ),
          _this = this;

      if( typeof( options ) === "string" ){
        _userElement = document.getElementById( options );
      }
      else {
        _userElement = document.getElementById( options.element ) || options.element;
      } //if

      _userElement.appendChild( _parent );
      _parent.style.height = "100%";
      _parent.appendChild( _container );

      $( _container ).sortable({
        containment: "parent",
        tolerance: "pointer",
        update: function( event, ui ) {

          _em.dispatch( "trackupdated", {
            track: _this.getTrack( ui.item[ 0 ].id ),
            index: ui.item.index()
          });
        }
      }).droppable({
        greedy: true
      });

      $( _parent ).droppable({
        // this is dropping an event on empty space
        drop: function( e, ui ) {
          if ( _dynamicTrackCreation && ui.draggable[ 0 ].className.indexOf( "ui-draggable" ) > -1 ) {
            var newTrack = _this.createTrack(),
                eventId = ui.draggable[ 0 ].id,
                formerTrackId = ui.draggable[ 0 ].parentNode.id,
                formerTrack = _tracks[ formerTrackId ],
                clientRects = _parent.getClientRects();
            _this.addTrack( newTrack );
            if( formerTrack ){
              newTrack.addTrackEvent( formerTrack.removeTrackEvent( eventId ) );
            }
            else {
              newTrack.createTrackEvent({
                left: ( e.clientX - clientRects[ 0 ].left ) / _scale,
                width: 50,
                innerHTML: ui.draggable[ 0 ].innerHTML
              });
            } //if
          } //if
        }
      });

      this.clear = function (){
        while( _container.children.length ){
          _container.removeChild( _container.children[ 0 ] );
        } //while
        _tracks = {};
      };

      function onTrackEventCreated( e ){
        $( e.data.element ).draggable( "option", "containment", _parent );
      } //onTrackEventCreated
      function onTrackEventSelected( e ){
        _this.deselectOthers( e.target );
      } //onTrackEventSelected

      this.createTrack = function( name ){
        var track = new Track({
              scale: _scale
            });

        if( name ){
          var titleElement = document.createElement( "span" );
          titleElement.style.postion = "absolute";
          titleElement.style.left = "5px";
          titleElement.style.top = "50%";
          titleElement.innerHTML = name;
          titleElement.className = "track-title";
          track.element.appendChild( titleElement );
        } //if

        track.listen( "trackeventcreated", onTrackEventCreated );
        track.repeatEvents( _em );

        _this.addTrack( track );
        return track;
      };

      this.getTracks = function(){
        return _tracks;
      };

      this.getTrack = function( id ){
        return _tracks[ id ];
      };

      this.addTrack = function( track ){
        _container.appendChild( track.element );
        _tracks[ track.element.id ] = track;
        _em.dispatch( "trackadded", {
          track: track
        });
      };

      this.removeTrack = function( track ){
        _container.removeChild( track.element );
        track.unlisten( "trackeventcreated", onTrackEventCreated );
        delete _tracks[ track.element.id ];
        track.unRepeatEvents( _em );
        _em.dispatch( "trackremoved", {
          track: track
        });
        return track;
      };

      this.deselectOthers = function( except ){
        for( var j in _tracks ){
          var events = _tracks[ j ].getTrackEvents();
          for( var i in events ){
            if( events[ i ].selected && events[ i ] !== except ){
              events[ i ].selected = false;
            } //if
          } //for
        } //for
        return _this;
      };

      Object.defineProperties( this, {
        scale: {
          get: function(){ return _scale; },
          set: function( scale ){
            _scale = scale;
            _userElement.style.width = _userElement.style.width || _duration * _scale + "px";
            _userElement.style.minWidth = _duration * _scale + "px";
            for( var t in _tracks ){
              if( _tracks.hasOwnProperty( t ) ){
                _tracks[ t ].scale = _scale;
              } //if
            } //for
          }
        },
        tracks: {
          get: function(){ return _tracks; }
        },
        numTracks: {
          get: function(){ return Object.keys( _tracks ).length; }
        }
      });

      _this.scale = options.scale || 1;

    } //init

    return new init();

  }; //Context

  return Context;

});
