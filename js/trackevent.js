define( [ "./eventmanager" ], function( EventManager ){
  var __guid = 0;

  function TrackEvent( options ) {
    var _id = "trackEvent" + __guid++,
        _element,
        _options = {},
        _em = new EventManager( this ),
        _scale = options.scale || 1,
        _selected = false,
        _this = this;

    function createEventElement(){
      var _element = document.createElement( "div" );

      // set options if they exist
      options.cursor && (_element.style.cursor = options.cursor);
      options.background && (_element.style.background = options.background);
      options.opacity && (_element.style.opacity = options.opacity);
      options.height && (_element.style.height = options.height);
      options.width && (_element.style.width = options.width * _scale + "px");
      options.position && (_element.style.position = options.position);
      options.left && (_element.style.left = options.left * _scale + "px");
      options.innerHTML && (_element.innerHTML = options.innerHTML);
      _element.style.position = options.position ? options.position : "absolute";

      // add css options if they exist
      if( options.css ){
        $( _element ).css( options.css );
      } //if

      _element.className = "trackliner-event";

      if( options.classes ){
        for( var i = 0; i < options.classes.length; ++i ){
          $( _element ).addClass( options.classes[ i ] );
        } //for
      } //if

      _element.id = _id;
      _element.style.top = options.top || "0px";

      return _element;
    } //createEventElement

    if( options ){
      var movedCallback = function( event, ui ){

        _element.style.top = "0px";
        _options.left = _element.offsetLeft;
        _options.width = _element.offsetWidth;

        //_em.dispatch( "trackeventupdated", {
        //  ui: ui 
        //});
      }; //movedCallback

      _options = options;
      _element = options.element || createEventElement();
     
      _element.addEventListener( "click", function( e ){
        _em.dispatch( "trackeventclicked", e );
        _this.selected = true;
      }, false);

      _element.addEventListener( "dblclick", function( e ){
        _em.dispatch( "trackeventdblclicked", e );
      }, false);

      $( _element ).draggable({
        //containment: "parent",
        zIndex: 9001,
        scroll: true,
        // this is when an event stops being dragged
        start: function ( event, ui ) {},
        stop: movedCallback
      }).resizable({ 
        autoHide: true, 
        containment: "parent", 
        handles: "e, w", 
        scroll: false,
        stop: movedCallback
      });

    } //if

    Object.defineProperties( this, {
      id: {
        get: function(){ return _id; }
      },
      element: {
        get: function(){ return _element; }
      },
      selected: {
        get: function(){ return _selected; },
        set: function( val ){
          if( _selected !== val ){
            _selected = val;
            if( _selected ){
              _em.dispatch( "trackeventselected" );
            }
            else {
              _em.dispatch( "trackeventdeselected" );
            } //if
          }
        }
      }
    });
  } //TrackEvent

  return TrackEvent;
});
