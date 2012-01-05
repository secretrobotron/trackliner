/*
  trackliner
  Copyright (C) 2011 Bobby Richter & Scott Downe

  Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    Neither the name of the Mozilla Foundation nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/
(function (root) {

  define( [ "./context" ], function( TrackLiner ){

    var trackliner = function( callback ){

      // Add your init code here.

      if( callback ) {
        callback();
      } //if

    }; //trackliner

    // In dev, there may be calls that are waiting for the implementation to
    // show up. Handle them now.
    var waiting;
    if( root.trackliner ){
      waiting = root.trackliner.__waiting;
      delete trackliner.__waiting;
    }
    trackliner.TrackLiner = TrackLiner;
    root.trackliner = trackliner;

    if( waiting ){
      for( var i=0, l=waiting.length; i<l; ++i ){
        trackliner.apply( {}, waiting[ i ] );
      }
    } //if

    return trackliner;

  }); //define

}( this ));
