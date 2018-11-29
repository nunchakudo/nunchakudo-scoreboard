// Global variables
      var TIMER_STARTTIME = 0;
      var TIMER_PAUSETIME = 0;
      var TIMER_MATCHTIME = 0;
      var TIMER_ZERO_BOOL = true;
      var TIMER_LASTSTATE;
var test;


      // Fancy format time
      function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}


      //Handle all timer related settings
      function manageTimer( state, fromDisplay ){
		  //console.log("manageTimer custom");
		//console.log("begin functie"+ TIMER_MATCHTIME + "-" + TIMER_PAUSETIME + "-" + TIMER_STARTTIME); 
        var newTimerState = state.timer;
        var newTimerMatchTime = state.matchTime;

        if( newTimerState != TIMER_LASTSTATE)
        {
			  //State has changed, take action
			  TIMER_LASTSTATE = newTimerState;

			  switch( newTimerState )
			  {
					case  'reset':
					  TIMER_MATCHTIME = newTimerMatchTime;
					  TIMER_STARTTIME = 0;
					  break;
					case 'started':
					  // If starttime is not 0; it means we restarted after a pause... ignore resetting of starttime
					  if( TIMER_STARTTIME === 0 )
					  {
						TIMER_STARTTIME = state.currentTime;
					  } 
					  else if( TIMER_PAUSETIME !== 0 )
					  {
						timeElapsed = TIMER_PAUSETIME - TIMER_STARTTIME;

						TIMER_STARTTIME =
						state.currentTime - timeElapsed; // corrigate for already elapsed time
						if(state.extraTime>0 && fromDisplay)
						{
							TIMER_MATCHTIME +=state.extraTime;
							state.extraTime=0;
							$.ajax
							({  // set state
								type: 'PATCH', url: 'http://'+window.location.host+':3000/state', data: JSON.stringify(state), contentType: 'application/json' 
							});	
						}
					  }
					  break;
					case 'paused':
					  TIMER_PAUSETIME = state.currentTime;
					  //console.log("paused"+ TIMER_MATCHTIME + "-" + TIMER_PAUSETIME + "-" + TIMER_STARTTIME); 
					  break;
			  }

        }

        // Even when the state doesn't change; always update matchtime unless a game is running or paused
        if( newTimerMatchTime != TIMER_MATCHTIME && newTimerState === 'reset')
        {
          TIMER_MATCHTIME = newTimerMatchTime;
          //  $("#timefield-wrapper").html( fmtMSS( TIMER_MATCHTIME ) );
        }
		var timeRemaining =0;
		var displayedTimeString='begin';
		
        if( newTimerState === 'started' )
        {
          // We're started, keep counting

			  var now = new Date();

			  if( typeof TIMER_TIMEDIV !== 'undefined' )
			  {
				now -= TIMER_TIMEDIV;
			  }

			  var startTime = TIMER_STARTTIME;

			  var timeElapsedSeconds = Math.round( (now - startTime)/1000 );
			  timeRemaining = TIMER_MATCHTIME - timeElapsedSeconds;
			  displayedTimeString = fmtMSS( timeRemaining );
			  
			  //console.log(timeRemaining);
			  if( timeRemaining < 0)
			  {
				 //console.log("na pauze"+ TIMER_MATCHTIME + "-" + TIMER_PAUSETIME + "-" + TIMER_STARTTIME); 
				  state.currentTime=new Date() - TIMER_TIMEDIV;              
				  //console.log("einde");
					// negative time
					state.timer='paused';
					$.ajax
					({  // set state
						type: 'PATCH', url: 'http://'+window.location.host+':3000/state', data: JSON.stringify(state), contentType: 'application/json' 
					});
					
			  }
        } 
        else if( newTimerState === 'paused' )
        {
			//console.log(TIMER_MATCHTIME + "-" + TIMER_PAUSETIME + "-" + TIMER_STARTTIME);
			  timeRemaining = TIMER_MATCHTIME - Math.round( (TIMER_PAUSETIME - TIMER_STARTTIME)/1000 );
			  displayedTimeString = fmtMSS( timeRemaining );

        } 
        else if( newTimerState === 'reset' )
        {
			  timeRemaining = TIMER_MATCHTIME;
			  displayedTimeString = fmtMSS( timeRemaining );
        }

        //console.log("time:" + timeRemaining + newTimerState);
		//console.log("na functie"+ TIMER_MATCHTIME + "-" + TIMER_PAUSETIME + "-" + TIMER_STARTTIME); 
		
		if(timeRemaining>0)
		{
			return displayedTimeString;
		}
        else
        {
            return '<span style="color:red">' + "EINDE" + '</span>'; 
		}
				 
      }

      // Convert straf integer to string
      function getStraf(number){
        switch(number){
          case 1:
            // Waarschuwing = bolleke
            return "<span style='color: red; size: 500%'>●</span>";
            break;
          case 2:
            // chui
            return "CHUI";
            break;
          case 3:
            // keikoku
            return "KEIKOKU";
            break;
          case 4:
            // keikoku-2
            return "KEIKOKU-2";
            break;
          case 5:
            return "HANSOKU-MAKI";
            // hansoku-maki
            break;
          default:
            return "-";
        }
      }

function getStrafRev(string)
{
  switch(string)
  {
    case '-':
      return 0;
      break;
    case "CHUI":
      // chui
      return 2;
      break;
    case "KEIKOKU":
      // keikoku
      return 3;
      break;
    case "KEIKOKU-2":
      // keikoku-2
      return 4;
      break;
    case "HANSOKU-MAKI":
      return 5;
      // hansoku-maki
      break;
    default:
      // Waarschuwing = bolleke
      return 1;

  }
}

function calculateStraf(straf)
{
   switch(straf) //int value
  {
    case 0:
      return 0;
      break;
    case 2:// chui
      return 0.5;
      break;
    case 3: // keikoku
      return 1;
      break;
    case 4:// keikoku-2
      return 2;
      break;
    case 5:
      return 6;// hansoku-maki
      break;
    default:// Waarschuwing = bolleke
      return 0;

  }
}
   
   
      // Convert category integer to string
      function getCategory(number){
        switch(number){
          case 1:
            return "<1.35m H";
            break;
          case 2:
            return "1.35m-1.45m H";
            break;
          case 3:
            return "1.45m-1.65m H";
            break;
          case 4:
            return "1.65m-1.75m H";
            break;
          case 5:
            return "1.75m-1.85m H";
            break;
          case 6:
            return ">1.85m H";
            break;
          case 11:
            return "<1.35m D";
            break;
          case 12:
            return "1.35m-1.45m D";
            break;
          case 13:
            return "1.45m-1.65m D";
            break;
          case 14:
            return "1.65m-1.75m D";
            break;
          case 15:
            return "1.75m-1.85m D";
            break;
          case 16:
            return ">1.85m D";
            break;
          default:
            return "-";
        }
      }
