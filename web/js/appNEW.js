// Global variables
      var TIMER_STARTTIME = 0;
      var TIMER_PAUSETIME = 0;
      var TIMER_MATCHTIME = 0;
      var TIMER_ZERO_BOOL = true;
      var TIMER_LASTSTATE;
var test;
      //initialize the system
      function initialize(){
         var nameYellow="yellow";
         var nameBlack="black";
         var nextMatch=false;
        // check which match to play
        $.getJSON( "http://"+window.location.host+":3000/matches", function( matches ) {
          for(var i=0;i<matches.length;i++)
          {
		if(matches[i].done==0)
                {
                   nextMatch=true;
	           nameYellow = matches[i].nameYellow;
                   nameBlack  = matches[i].nameBlack;
                   break; // stop for loop 
                }
          }
          
          $('.namefields [data-player="1"] [data-field="name"]').html( nameYellow );
          $('.namefields [data-player="2"] [data-field="name"]').html( nameBlack );
          
          // Example for setting clubname of player 1
          //~ $('.namefields [data-player="1"] [data-field="clubname"]').html( nameYellow );

		  // Send new 'match' to server
          var patch = { "nameYellow": nameYellow, "nameBlack": nameBlack  };
          $.ajax({
              type: 'PATCH',
              url: 'http://' + window.location.host +':3000/event',
              data: JSON.stringify(patch),
              // processData: false,
              contentType: 'application/json'
              /* success and error handling omitted for brevity */
          }); 
        }); 

        // Every second, get the state from the server!
        setInterval(getUpdatedState, 1000);
      }

      // Get the state from the server
      function getUpdatedState(){
        $.getJSON( "http://"+window.location.host+":3000/state", function( state,status,xhr ) {
          // Display the scores
          
          var score = state.score;
          $('.scoring [data-player="1"] [data-field="waza-ari"]').html( score["waza-ari"][0] );
          $('.scoring [data-player="2"] [data-field="waza-ari"]').html( score["waza-ari"][1] );
          $('.scoring [data-player="1"] [data-field="ippon"]').html( score.ippon[0]);
          $('.scoring [data-player="2"] [data-field="ippon"]').html( score.ippon[1]);

          // Convert straf to string and display
          $('.scoring [data-player="1"] [data-field="straf"]').html( getStraf(score.straf[0]) );
          $('.scoring [data-player="2"] [data-field="straf"]').html( getStraf(score.straf[1]) )

          // Manage the timer
          manageTimer( state );

        });
      }
    


      // Resize when the window is first loaded
      $(window).on('load', function () {
         initialize();
      });
