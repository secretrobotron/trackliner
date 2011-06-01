(function(window) {
  //<script src="http://code.jquery.com/jquery-1.5.js"></script>
  //<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui.js"></script>

  var plugins = {};

  function addPlugin ( name, def ) {
    if ( name ) {
      plugins[name] = def;
    } //if
  } //addPlugin

  var TrackLiner = this.TrackLiner = function( options ) {

    var tracks = {},
        trackCount = 0,
        eventCount = 0,
        userElement,
        duration = (options && options.duration) || 1,
        scale = (options && options.scale) || window.width/2,
        parent = document.createElement( "div" ),
        container = document.createElement( "div" ),
        self = this;

    if ( this !== window ) {

      if ( typeof(options) === 'string' ) {
        userElement = document.getElementById(options);
      }
      else {
        userElement = document.getElementById(options.element);
      } //if

      userElement.appendChild( parent );
      parent.style.height = "100%";
      parent.appendChild( container );

      $( container ).sortable( { containment: "parent", tolerance: 'pointer' } ).droppable( { greedy: true } );

      $( parent ).droppable({
        // this is dropping an event on empty space
        drop: function( event, ui ) {
  
          if ( ui.draggable[ 0 ].className.indexOf( "ui-draggable" ) > -1 ) {
  
            var eventId = ui.draggable[ 0 ].id,
                type = ui.draggable[ 0].getAttribute('data-type') || 'default',
                parentId = ui.draggable[ 0 ].parentNode.id,
                newTrack = self.createTrack();

            if ( self.getTrack( parentId ) ) {
              newTrack.addTrackEvent( self.getTrack( parentId ).removeTrackEvent( eventId ) );
            } else {
              newTrack.createTrackEvent( type, {}, event, ui );
            } //if

          } //if
        }
      });

      this.createTrack = function() {

        //index = ~index || ~trackArray.length;
        var track = new Track();
        container.appendChild( track.getElement() );
        tracks[ track.getElement().id ] = track;//.splice( ~index, 0, track );
        return track;
      };

      this.getTrack = function( id ) {

        return tracks[ id ];
      };

      this.addTrack = function( track ) {

        container.appendChild( track.getElement() );
        tracks[ track.getElement().id ] = track;
      };

      this.removeTrack = function( track ) {

        container.removeChild( track.getElement() );
        delete tracks[ track.getElement().id ];
        return track;
      };

      this.plugins = plugins;

      this.plugin = addPlugin;

      this.setScale = function ( scale ) {
        userElement.style.width = duration * scale + "px";
        userElement.style.minWidth = duration * scale + "px";
      };

      this.setScale(scale);

      var Track = function(inc) {

        var trackId = "trackLiner" + trackCount++,
            events = {},
            that = this,
            element = document.createElement( "div" );

        element.style.background = "-moz-linear-gradient(top,  #eee,  #999)";
        element.style.height = "36px";
        element.style.position = "relative";
        element.id = trackId;

        $( element ).droppable( { greedy: true,
          // this is dropping an event on a track
          drop: function( event, ui ) {

            var eventId = ui.draggable[ 0 ].id,
                trackId = this.id,
                type = ui.draggable[ 0].getAttribute('data-type') || 'default',
                parentId = ui.draggable[ 0 ].parentNode.id;

            if ( self.getTrack( parentId ) ) {
              self.getTrack( trackId ).addTrackEvent( self.getTrack( parentId ).removeTrackEvent( eventId ) );
            } else {

              if ( type && plugins[ type ]) {
                self.getTrack( trackId ).createTrackEvent( type, {}, event, ui );
              } //if

            } //if
          }
        });

        this.getElement = function() {

          return element;
        };

        this.createTrackEvent = function( type, inputOptions, event, ui ) {

          var trackEvent = {},
              eventId = "trackEvent" + eventCount++,
              inputOptions = typeof(type) === 'string' ? inputOptions : type,
              type = typeof(type) === 'string' ? type : 'default',
              pluginDef = plugins[ type ];
              
          if (pluginDef) {

            var trackOptions = plugins[ type ].setup( that, inputOptions );
            var callback = function( event, ui ) {

              var eventElement = ui.helper[ 0 ],
                  trackObject = self.getTrack( eventElement.parentNode.id ),
                  trackElement = trackObject.getElement(),
                  eventObject = trackObject.getTrackEvent( eventElement.id ).event;

              eventElement.style.top = "0px";
              pluginDef.moved( eventObject, eventElement, trackElement );
            };

            trackEvent.event = event;
            trackEvent.element = document.createElement( "div" );
            trackEvent.element.style.cursor = "move";
            trackEvent.element.style.background = "-moz-linear-gradient(top,  #ff0,  #660)";
            trackEvent.element.style.opacity = "0.5";
            trackEvent.element.style.height = "100%";
            trackEvent.element.style.width = trackOptions.width ? trackOptions.width*scale + "px" : "100px";
            trackEvent.element.style.position = "absolute";
            trackEvent.element.style.top = "0px";
            trackEvent.element.style.left = trackOptions.left ? trackOptions.left*scale + "px" : "0px";
            trackEvent.element.id = eventId;
            trackEvent.type = type;
            //trackEvent.element = element;

            $( trackEvent.element ).draggable( { /*grid: [ 1, 36 ],*/ containment: parent, zIndex: 9001, scroll: true,
              // this is when an event stops being dragged
              stop: callback
            }).resizable( { autoHide: true, containment: "parent", handles: 'e, w', scroll: false,
              stop: callback
            });

            this.addTrackEvent( trackEvent );

            return this;
          } //if
        };

        this.addTrackEvent = function( trackEvent ) {

          events[ trackEvent.element.id ] = trackEvent;
          element.appendChild( trackEvent.element );
          return this;
        };

        this.getTrackEvent = function( id ) {

          return events[ id ];
        };

        this.removeTrackEvent = function( id ) {

          var trackEvent = events[ id ];
          delete events[ id ];
          element.removeChild( trackEvent.element );
          return trackEvent;
        };
        
        /*this.length = function() {

          return eventArray.length;
        };*/

        this.toString = function() {

          return trackId;
        };
      };

      /*this.length = function() {

        return trackArray.length;
      };*/

      return this;

    } //if (this !== window)

  }; //TrackLiner

  TrackLiner.plugin = addPlugin;

  window.TrackLiner = TrackLiner;

  TrackLiner.plugin( 'default', {
    setup: function ( track, options ) {
      var left = options.left || options.x || options.start || 0;
      var width = options.width || options.end ? options.end - left : 1;
      return {
        left: left,
        width: width,
      };
    },
    moved: function () {
    },
    click: function () {
    },
  });

}(window));

