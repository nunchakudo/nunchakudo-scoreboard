var TIMER_TIMEDIV = 0;

//initialize the system
      function initialize(){
		  
	     //console.log("initialize admin");
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

          $("#name-Yellow").html( nameYellow );
          $("#name-Black").html( nameBlack );
         // put new names in event  todo fixen saved niet in file

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

        // Once, get the name of the event
        $.getJSON( "http://"+window.location.host+":3000/event", function( event ) {
          $("#event-name").html( event.name );
          // from matches $("#name-Yellow").html( event.nameYellow ); //done in match load
          // from matches $("#name-Black").html( event.nameBlack );   //done in match load
        });

        // Every second, get the state from the server!
        setInterval(getUpdatedState, 1000);
      }

      // Get the state from the server
      function getUpdatedState(){
        $.getJSON( "http://"+window.location.host+":3000/event", function( event ) {
          $("#event-name").not('.no-update').html( event.name ); //only update if the no-update class is not present
	  //$("#name-Yellow").not('.no-update').html( event.nameYellow ); //only update if the no-update class is not present
        });

        $.getJSON( "http://"+window.location.host+":3000/state", function( state,status,xhr ) {
		test = xhr
	  // console.log(xhr);
          // Display the scores
          var score = state.score;
          $("#waza-ari-1").html( score["waza-ari"][0]);
          $("#waza-ari-2").html( score["waza-ari"][1]);
          $("#ippon-1").html( score.ippon[0]);
          $("#ippon-2").html( score.ippon[1]);

          // Convert straf to string and display
          $("#straf-1").html( getStraf(score.straf[0]) );
          $("#straf-2").html( getStraf(score.straf[1]) )
         	$("#timefield-wrapper").html(manageTimer( state, false ));
         	//console.log($('#startPause').text() +"-"+ state.timer);
			// knop tekst juist zetten bij aankomst timer op 0
			if($('#startPause').text()=== 'Pause' && state.timer=== 'paused' )
			{
				$('#startPause').html('Start');
				$('#reset').prop('disabled', false);
			}				
        });
      }

function handleTitleEvents()
{
  $("#event-name").focus(function(e)
  {
    $("#event-name").addClass('no-update');
  });
  
  $("#event-name").focusout(function(e)
  { // event name adjusted => send to database
    var patch = { "name": $("#event-name").text() };
    $.ajax
    ({ 
       type: 'PATCH', url: 'http://' + window.location.host +':3000/event', data: JSON.stringify(patch), contentType: 'application/json'
       /* success and error handling omitted for brevity */
    });
    $("#event-name").removeClass('no-update');
  });
}





function updateScore(pressedButton)
{
  var entry = $(pressedButton).attr('data-entry');
  var playerId = $(pressedButton).attr('data-player');
  var action = $(pressedButton).attr('data-action');

  var thisScore
  switch (entry)
  {
    case 'straf':
    thisScore = [
      getStrafRev($("#" + entry + "-1").text()),
      getStrafRev($("#" + entry + "-2").text())
    ];
      break;
    default:
      thisScore = [
        parseInt($("#" + entry + "-1").text()),
        parseInt($("#" + entry + "-2").text())
      ];
  }

  //console.log(thisScore);

  switch(action)
  {
    case '+':
      if(entry=='ippon' && thisScore[ ((playerId -1)) ]<3)
            thisScore[ ((playerId -1)) ] += 1;
      else if(entry=='waza-ari' && thisScore[ ((playerId -1)) ]<6)
            thisScore[ ((playerId -1)) ] += 1;
      else if(entry=='straf' && thisScore[ ((playerId -1)) ]<5)
            thisScore[ ((playerId -1)) ] += 1;    
      break;
    case '-':
	if(thisScore[ ((playerId -1)) ]>0)
	      thisScore[ ((playerId -1)) ] -= 1;
      break;
  }

  $.getJSON( "http://"+window.location.host+":3000/state", function( state ) 
  {
     state.score[entry] = thisScore;
     $.ajax
     ({ 
         type: 'PATCH', url: 'http://'+window.location.host+':3000/state', data: JSON.stringify(state), contentType: 'application/json' 
     });
  });
};

function handleScoreEvents()
{
  //WAZA ARI
  $("button[data-entry='waza-ari']").click(function(e)
  {
      updateScore($(this));
  });

  $("button[data-entry='ippon']").click(function(e)
  {
      updateScore($(this));
  });

  $("button[data-entry='straf']").click(function(e)
  {
     updateScore($(this));
  });
}

function updateTime(target)
{
  $.getJSON( "http://"+window.location.host+":3000/state", function( state ) 
  { // get state
    for ( var key in target )
    {
      if ( target.hasOwnProperty(key) ) 
      {
	if(key<0)
        {
	   //game  paused; set to start
		 //  console.log("Key is " + key + ", value is " + target[key]);
           $('#startPause').html('Start');
           $('#reset').prop('disabled', false);
           updateObject = { 'timer': 'paused', 'currentTime': 0 }
        }
        //
        state[key] = target[key];
      }
    }
    $.ajax
    ({  // set state
        type: 'PATCH', url: 'http://'+window.location.host+':3000/state', data: JSON.stringify(state), contentType: 'application/json' 
    });
  });
}

function handleTimeEvents()
{
  //update match time when buttons are pressed
  // get time and show local
  // only when a button is pressed
  //console.log("test");
  $.getJSON( "http://"+window.location.host+":3000/state", function( state ) 
  {
	  
      var mins = Math.floor(state.matchTime / 60);
      var secs = state.matchTime % 60;

      $("#time-min").html( mins );
      $("#time-sec").html( secs );

  });
  // what todo with start or pause
  $('#startPause').click(function(e)
  {
		startPauseValue = $('#startPause').text();
		var updateObject;
		switch(startPauseValue)
		{
		  case 'Start':
			//game started; set button to pause
			$('#startPause').html('Pause');
			$('#reset').attr('disabled','disabled');
			//console.log("hier start");
			updateObject = { 'timer': 'started', 'currentTime': + new Date() - TIMER_TIMEDIV };
			updateTime( updateObject );
			break;
		  case 'Pause':
			//game  paused; set button to start
			$('#startPause').html('Start');
			$('#reset').prop('disabled', false);
			//console.log("hier pauze");
			updateObject = { 'timer': 'paused', 'currentTime': + new Date() - TIMER_TIMEDIV };
			updateTime( updateObject );
		}
  });

  // what todo with extra time
  $("#ExtraTime").click(function(e)
  {
	  $('#startPause').html('Pause');
      $('#reset').attr('disabled','disabled');
      updateObject = {'extraTime':60,'timer':'started', 'currentTime': + new Date() - TIMER_TIMEDIV };
      updateTime( updateObject );
      TIMER_MATCHTIME +=60;
  });
  
  // what todo with save
  $("#save").click(function(e)
  {
    var endState;  //final values
    var endEvent;  //final values
    var endMatch;
    var done=false;
    $.getJSON( "http://"+window.location.host+":3000/state", function( state ) { endState=state; }); //get state //console.log(endState);
    $.getJSON( "http://"+window.location.host+":3000/event", function( event ) 
    { 
        endEvent=event;
        $.getJSON( "http://"+window.location.host+":3000/matches?nameYellow="+endEvent.nameYellow+"&nameBlack="+endEvent.nameBlack,function( matches ) { endMatch=matches; done=true;}); //get match
    }); //get event
    // calculate end score
    // yellow
    console.log(endState);
    console.log(endEvent);
    console.log(endMatch);
//    var scoreYellow=endState["waza-ari"][0]+endState["ippon"][0]*2-calculateStraf(endState["straf"][0]);
//    var scoreBlack=endState["waza-ari"][1]+endState["ippon"][1]*2-calculateStraf(endState["straf"][1]);
    var result="Yellow";
//    if(scoreYellow==scoreBlack) //hentai
//       call dialog to ask for hentai winner
//       result is Yellow or Black
//  else
//    if(scoreYellow< scoreBlack) 
//      result="Black";
    endMatch["result"]=result;
    endMatch["done"]=1;
    console.log(endMatch);
    // send updateObject to json file (matches)
    // load new match (reload page tv and admin?)
    //updateTime( updateObject );
  });

  $("#reset").click(function(e)
  {
    updateObject = 
    {
      'timer': 'reset',
      'currentTime': 0,
      'score': { 'waza-ari': [0,0], 'ippon': [0,0], 'straf': [0,0] }
    }
    updateTime( updateObject );
  });

  $("button[data-entry='time-min']").click(function(e)
  {
      updateMatchTime($(this));
  });
  $("button[data-entry='time-sec']").click(function(e)
  {
     updateMatchTime($(this));
  });
}

function updateMatchTime(pressedButton)
{
	
  var entry = $(pressedButton).attr('data-entry');
  var action = $(pressedButton).attr('data-action');

  switch (entry)
  {
    case 'time-min':
      $.getJSON( "http://"+window.location.host+":3000/state", function( state ) 
      {
        if( action == '+' )
          state.matchTime += 60;
        else if( state.matchTime >= 60)
          state.matchTime -= 60;
        
        

        // update server
        $.ajax
        ({ 
           type: 'PATCH', url: 'http://'+window.location.host+':3000/state', data: JSON.stringify(state), contentType: 'application/json' 
        });

        //update local view
        var mins = Math.floor(state.matchTime / 60);
        var secs = state.matchTime % 60;
        $("#time-min").html( mins );
        $("#time-sec").html( secs );
      });
      break;
    default:
      $.getJSON( "http://"+window.location.host+":3000/state", function( state ) 
      {
        if( action == '+' )
          state.matchTime += 5;
        else if( state.matchTime >= 5)
          state.matchTime -= 5;

        //update server
        $.ajax
        ({ 
            type: 'PATCH', url: 'http://'+window.location.host+':3000/state', data: JSON.stringify(state), contentType: 'application/json' 
        });

        //update local view
        var mins = Math.floor(state.matchTime / 60);
        var secs = state.matchTime % 60;
        $("#time-min").html( mins );
        $("#time-sec").html( secs );
      });
  }
}

$(window).on('load', function()
{
  // Get server / client time difference
  $.get('//'+window.location.host+'/?t='+((+ new Date())),function(data,status,xhr)
  {
    var servertime = ((+ new Date(xhr.getResponseHeader('Date'))));
    var clienttime = ((+ new Date()));
    var timediv = clienttime - servertime;
    //  console.log('servertime', servertime );
    //  console.log('clienttime',clienttime );
    //  console.log('timediv', timediv);
    TIMER_TIMEDIV = timediv;
  });
  
  initialize();

  handleTitleEvents();
  handleScoreEvents();
  handleTimeEvents();
});
