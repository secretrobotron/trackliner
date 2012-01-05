define( [ "./logger" ], function( Logger ){

/*
  const EVENT_LOOP_PAUSE = 0;

  var EventLoop = function(){
    var _events = [],
        _started = false;

    function processEvents(){
      var events = _events,
          listeners, event, j, jl;
      _events = [];
      for( var i=0, l=events.length; i<l; ++i ){
        listeners = events[ i ].listeners;
        event = events[ i ].event;
        for( j=0, jl=listeners.length; j < jl; ++j ){
          listeners[ j ]( event );
        } //for
      } //for
      if( _events.length > 0 ) {
        processEvents();
      }
      else {
        _started = false;
      } //if
    } //processEvents

    this.addEvent = function( e, listeners ){
      _events.push({
        event: e,
        listeners: listeners
      });
    }; //addEvent

    this.execute = function(){
      if( _started ) return;
      _started = true;
      processEvents();
    }; //execute

    this.start = function(){
      if( !_started ) {
        _started = true;
        setTimeout( processEvents, EVENT_LOOP_PAUSE );
      } //if
    }; //start
  }; //EventLoop
  var __eventLoop = new EventLoop();
*/

  var Event = function( type, data, target, currentTarget ){
    var _type = type + "",
        _target = target,
        _data = data;
    Object.defineProperty( this, "type", { get: function() { return _type; } } );
    Object.defineProperty( this, "data", { get: function() { return _data; } } );
    this.currentTarget = currentTarget || target;
  }; //Event

  var EventManager = function( object ){
    var _listeners = [],
        _parents = [],
        _target = this,
        _this = this;

    function callListeners( e, listeners ){
      for( var i=0, l=listeners.length; i<l; ++i ){
        listeners[ i ]( e );
      } //for
    } //callListeners

    this.dispatch = function( eventName, eventData ){
      if( !eventName ){
        throw new Error( "event type required to dispatch an event." );
      }
      var e;
      if( eventName instanceof Event ){
        e = eventName;
        eventName = e.type;
      }
      else {
        e = new Event( eventName, eventData, _target, _this );
      } //if
      if( _listeners[ eventName ] ) {
        //__eventLoop.addEvent( e, _listeners[ eventName ].slice() );
        //__eventLoop.execute();
        //__eventLoop.start();
        callListeners( e, _listeners[ eventName ] );
      } //if
      for( var i=0, l=_parents.length; i<l; ++i ){
        _parents[ i ].repeat( e );
      } //for
    }; //dispatch

    this.listen = function( eventName, listener ){
      if( !eventName || !listener ){
        throw new Error( "type and listener required to listen for event." );
      }
      if( !_listeners[ eventName ] ) {
        _listeners[ eventName ] = [];
      }
      _listeners[ eventName ].push( listener );
    }; //listen

    this.unlisten = function( eventName, listener ){
      if( !eventName || !listener ){
        throw new Error( "type and listener required to unlisten for event" );
      }
      var theseListeners = _listeners[ eventName ];
      if( theseListeners ) {
        if( listener ) {
          var idx = theseListeners.indexOf( listener );
          if( idx > -1 ) {
            theseListeners.splice( idx, 1 );
          } //if
        }
        else {
          _listeners[ eventName ] = [];
        }
      } //if
    }; //unlisten

    this.repeat = function( e ){
      e.currentTarget = _target;
      _this.dispatch( e );
    }; //repeat

    this.repeatEvents = function( parentEm ){
      _parents.push( parentEm );
    }; //repeatEvents

    this.unRepeatEvents = function( parentEm ){
      _parents.splice( _parents.indexOf( parentEm ), 1 );
    }; //unRepeatEvents

    this.apply = function( object ){
      object.listen = _this.listen;
      object.unlisten = _this.unlisten;
      object.dispatch = _this.dispatch;
      object.repeatEvents = _this.repeatEvents;
      object.unRepeatEvents = _this.unRepeatEvents;
      _target = object;
    }; //apply

    if( object ) {
      this.apply( object );
    } //if

    Object.defineProperties( this, {
      target: {
        get: function(){
          return _target;
        }
      }
    });

  }; //EventManager

  return EventManager;

});

